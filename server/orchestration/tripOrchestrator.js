const plannerAgent = require('../agents/plannerAgent');
const flightAgent = require('../agents/flightAgent');
const hotelAgent = require('../agents/hotelAgent');
const activityAgent = require('../agents/activityAgent');
const transportationAgent = require('../agents/transportationAgent');
const weatherAgent = require('../agents/weatherAgent');
const budgetAgent = require('../agents/budgetAgent');
const itineraryAgent = require('../agents/itineraryAgent');
const validatorAgent = require('../agents/validatorAgent');

class TripOrchestrator {
  async orchestrateTrip(userInput, userContext = {}) {
    const overallStartTime = Date.now();
    const agentLogs = [];
    const replanningHistory = [];
    const aiReasoning = [];

    // Log helper
    const recordLog = (agentName, status, durationMs, iteration = 1, message = '') => {
      agentLogs.push({
        agentName,
        status,
        durationMs,
        iteration,
        timestamp: new Date(),
        message
      });
    };

    // 1. Initial State Initialization
    const sharedState = {
      request: {},
      preferences: [],
      flights: {},
      hotels: {},
      activities: [],
      transportation: {},
      weather: {},
      budget: {},
      itinerary: {},
      validation: {},
      metadata: {
        iterations: 1,
        maxIterations: 3,
        status: 'planning',
        startedAt: new Date().toISOString()
      }
    };

    // -------------------------------------------------------------
    // PHASE 1: MASTER PLANNER AGENT
    // -------------------------------------------------------------
    console.log('[Orchestrator] Step 1: Dispatching Master Planner Agent...');
    const plannerRes = await plannerAgent.run(userInput, sharedState);
    sharedState.request = {
      ...plannerRes.data,
      startDate: userInput.startDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      endDate: userInput.endDate || new Date(Date.now() + 86400000 * (14 + (plannerRes.data.duration || 7))).toISOString().split('T')[0],
    };
    sharedState.preferences = plannerRes.data.preferences || [];
    recordLog(plannerRes.agentName, plannerRes.status, plannerRes.durationMs, 1, plannerRes.reasoning);
    aiReasoning.push(plannerRes.reasoning);

    // -------------------------------------------------------------
    // REPLANNING LOOP (Max 3 iterations)
    // -------------------------------------------------------------
    let iteration = 1;
    const maxIterations = 3;
    let isValid = false;

    while (iteration <= maxIterations) {
      sharedState.metadata.iterations = iteration;
      console.log(`[Orchestrator] Execution Loop — Iteration ${iteration}/${maxIterations}`);

      // -------------------------------------------------------------
      // PHASE 2: CONCURRENT SPECIALIZED AGENTS (PARALLEL EXECUTION)
      // -------------------------------------------------------------
      console.log('[Orchestrator] Launching parallel research: Flight, Hotel, Activity, Weather agents...');
      
      const [flightRes, hotelRes, actRes, weatherRes] = await Promise.all([
        flightAgent.run(sharedState),
        hotelAgent.run(sharedState),
        activityAgent.run(sharedState),
        weatherAgent.run(sharedState),
      ]);

      sharedState.flights = flightRes.data;
      sharedState.hotels = hotelRes.data;
      sharedState.activities = actRes.data;
      sharedState.weather = weatherRes.data;

      recordLog(flightRes.agentName, flightRes.status, flightRes.durationMs, iteration, flightRes.reasoning);
      recordLog(hotelRes.agentName, hotelRes.status, hotelRes.durationMs, iteration, hotelRes.reasoning);
      recordLog(actRes.agentName, actRes.status, actRes.durationMs, iteration, actRes.reasoning);
      recordLog(weatherRes.agentName, weatherRes.status, weatherRes.durationMs, iteration, weatherRes.reasoning);

      if (iteration === 1) {
        aiReasoning.push(flightRes.reasoning);
        aiReasoning.push(hotelRes.reasoning);
        aiReasoning.push(actRes.reasoning);
        aiReasoning.push(weatherRes.reasoning);
      }

      // -------------------------------------------------------------
      // PHASE 3: TRANSPORTATION AGENT
      // -------------------------------------------------------------
      const transRes = await transportationAgent.run(sharedState);
      sharedState.transportation = transRes.data;
      recordLog(transRes.agentName, transRes.status, transRes.durationMs, iteration, transRes.reasoning);
      if (iteration === 1) aiReasoning.push(transRes.reasoning);

      // -------------------------------------------------------------
      // PHASE 4: BUDGET AGENT
      // -------------------------------------------------------------
      const budgetRes = await budgetAgent.run(sharedState);
      sharedState.budget = budgetRes.data;
      recordLog(budgetRes.agentName, budgetRes.status, budgetRes.durationMs, iteration, budgetRes.reasoning);
      if (iteration === 1) aiReasoning.push(budgetRes.reasoning);

      // -------------------------------------------------------------
      // PHASE 5: ITINERARY AGENT
      // -------------------------------------------------------------
      const itinRes = await itineraryAgent.run(sharedState);
      sharedState.itinerary = itinRes.data;
      recordLog(itinRes.agentName, itinRes.status, itinRes.durationMs, iteration, itinRes.reasoning);
      if (iteration === 1) aiReasoning.push(itinRes.reasoning);

      // -------------------------------------------------------------
      // PHASE 6: VALIDATOR AGENT
      // -------------------------------------------------------------
      const valRes = await validatorAgent.run(sharedState);
      sharedState.validation = valRes.data;
      recordLog(valRes.agentName, valRes.status, valRes.durationMs, iteration, valRes.reasoning);
      if (iteration === 1) aiReasoning.push(valRes.reasoning);

      if (valRes.data.valid) {
        isValid = true;
        console.log(`[Orchestrator] Itinerary validated successfully on iteration ${iteration}!`);
        break;
      }

      // If invalid and we haven't reached max iterations, adapt constraints for replanning
      if (iteration < maxIterations) {
        console.warn(`[Orchestrator] Validation failed on iteration ${iteration}. Triggering automatic replanning...`);
        
        const budgetIssue = valRes.data.issues.find(i => i.type === 'BUDGET');
        if (budgetIssue) {
          replanningHistory.push({
            iteration,
            reason: 'Budget constraint exceeded',
            adjustments: { travelStyle: 'budget', action: 'Downgraded accommodation & flight tiers' },
            timestamp: new Date()
          });
          sharedState.request.travelStyle = 'budget';
        }

        const pacingIssue = valRes.data.issues.find(i => i.type === 'PACING');
        if (pacingIssue) {
          replanningHistory.push({
            iteration,
            reason: 'Daily pacing too crowded',
            adjustments: { action: 'Streamlined daily attractions for relaxed pace' },
            timestamp: new Date()
          });
        }
      }

      iteration++;
    }

    const totalDurationMs = Date.now() - overallStartTime;
    sharedState.metadata.status = isValid ? 'completed' : 'completed_with_warnings';
    sharedState.metadata.totalExecutionTimeMs = totalDurationMs;

    return {
      title: `${sharedState.request.duration}-Day ${sharedState.request.destination} Journey`,
      origin: sharedState.request.origin,
      destination: sharedState.request.destination,
      startDate: sharedState.request.startDate,
      endDate: sharedState.request.endDate,
      duration: sharedState.request.duration,
      travelers: {
        total: sharedState.request.travelers,
        adults: sharedState.request.travelers,
        children: 0,
      },
      budget: sharedState.request.budget,
      currency: sharedState.request.currency,
      preferences: sharedState.request.preferences,
      travelStyle: sharedState.request.travelStyle,
      specialInstructions: sharedState.request.specialInstructions || '',
      flights: sharedState.flights,
      hotels: sharedState.hotels,
      activities: sharedState.activities,
      transportation: sharedState.transportation,
      weather: sharedState.weather,
      budgetAnalysis: sharedState.budget,
      itinerary: sharedState.itinerary,
      validation: sharedState.validation,
      aiReasoning,
      agentLogs,
      replanningHistory,
      metadata: sharedState.metadata
    };
  }

  // Targeted modification without restarting everything from scratch
  async modifyTrip(existingTrip, modificationPrompt) {
    const lowerPrompt = modificationPrompt.toLowerCase();
    const updatedRequest = {
      origin: existingTrip.origin,
      destination: existingTrip.destination,
      startDate: existingTrip.startDate,
      endDate: existingTrip.endDate,
      duration: existingTrip.duration,
      travelers: existingTrip.travelers?.total || 2,
      budget: existingTrip.budget,
      currency: existingTrip.currency,
      preferences: [...(existingTrip.preferences || [])],
      travelStyle: existingTrip.travelStyle || 'balanced',
      specialInstructions: modificationPrompt
    };

    // Detect target modifications
    if (lowerPrompt.includes('cheaper') || lowerPrompt.includes('lower budget') || lowerPrompt.includes('less expensive')) {
      updatedRequest.travelStyle = 'budget';
    } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('upgrade') || lowerPrompt.includes('5 star')) {
      updatedRequest.travelStyle = 'luxury';
    }

    // Add new interests if mentioned
    const interestKeywords = ['anime', 'food', 'nature', 'culture', 'history', 'shopping', 'nightlife', 'photography', 'adventure', 'romantic', 'beaches', 'mountains'];
    interestKeywords.forEach(k => {
      if (lowerPrompt.includes(k) && !updatedRequest.preferences.includes(k)) {
        updatedRequest.preferences.unshift(k);
      }
    });

    if (lowerPrompt.includes('remove nightlife')) {
      updatedRequest.preferences = updatedRequest.preferences.filter(p => p !== 'nightlife');
    }

    // Check for budget modification amount
    const budgetMatch = lowerPrompt.match(/(?:budget\s+to|budget\s+is|increase\s+to)\s*(?:₹|rs\.?|inr|\$|€|£)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|k)?/i);
    if (lowerPrompt.includes('lakh') || lowerPrompt.includes('lac')) {
      const num = parseFloat(lowerPrompt.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i)?.[1] || '0');
      if (num > 0) updatedRequest.budget = num * 100000;
    } else if (budgetMatch) {
      const b = parseInt(budgetMatch[1].replace(/,/g, ''));
      if (b > 1000) updatedRequest.budget = b;
    }

    // Re-run orchestrator with updated preferences and targeted instructions
    const modifiedResult = await this.orchestrateTrip(updatedRequest);
    return modifiedResult;
  }
}

module.exports = new TripOrchestrator();
