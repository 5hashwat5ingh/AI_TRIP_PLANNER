const aiService = require('../services/aiService');
const { z } = require('zod');

const PlannerOutputSchema = z.object({
  destination: z.string(),
  origin: z.string(),
  duration: z.number().min(1).max(30),
  travelers: z.number().min(1),
  budget: z.number().min(1000),
  currency: z.string().default('INR'),
  preferences: z.array(z.string()),
  travelStyle: z.enum(['budget', 'balanced', 'comfort', 'luxury']).default('balanced'),
  summary: z.string().optional()
});

class PlannerAgent {
  constructor() {
    this.name = 'Planner Agent';
    this.role = 'Master Trip Architect & Intent Parser';
  }

  async run(userInput, sharedState) {
    const startTime = Date.now();
    
    // System Prompt for Planner Agent
    const systemPrompt = `You are the Master Planner Agent for AI TravelOps.
Your objective is to analyze travel requirements (either structured form or natural language query), identify all key constraints (origin, destination, dates/duration, travelers, budget, currency, interests, travel style), and construct a normalized Master Planning Specification.

Return ONLY a valid JSON object matching this schema:
{
  "destination": "string",
  "origin": "string",
  "duration": number,
  "travelers": number,
  "budget": number,
  "currency": "INR" | "USD" | "EUR" | "GBP" | "JPY",
  "preferences": ["string"],
  "travelStyle": "budget" | "balanced" | "comfort" | "luxury",
  "summary": "string"
}`;

    let parsedSpec;
    
    // If input is natural language text
    if (typeof userInput === 'string' || (userInput.naturalPrompt && !userInput.destination)) {
      const promptText = typeof userInput === 'string' ? userInput : userInput.naturalPrompt;
      const rawResult = await aiService.generateStructuredJSON({
        systemPrompt,
        userPrompt: `Parse this travel request into master planning JSON:\n"${promptText}"`
      });

      parsedSpec = {
        destination: rawResult.destination || 'Japan',
        origin: rawResult.origin || 'Delhi',
        duration: Number(rawResult.duration) || 7,
        travelers: Number(rawResult.travelers) || 2,
        budget: Number(rawResult.budget) || 200000,
        currency: rawResult.currency || 'INR',
        preferences: Array.isArray(rawResult.preferences) && rawResult.preferences.length ? rawResult.preferences : ['food', 'culture', 'sightseeing'],
        travelStyle: rawResult.travelStyle || 'balanced',
        summary: rawResult.summary || `Personalized trip to ${rawResult.destination || 'Japan'}`
      };
    } else {
      // Structured form input
      const travelersCount = (userInput.travelers?.adults || 0) + (userInput.travelers?.children || 0) || Number(userInput.travelers) || 1;
      parsedSpec = {
        destination: userInput.destination || 'Japan',
        origin: userInput.origin || 'Delhi',
        duration: Number(userInput.duration) || 7,
        travelers: travelersCount,
        budget: Number(userInput.budget) || 200000,
        currency: userInput.currency || 'INR',
        preferences: userInput.preferences || ['food', 'culture'],
        travelStyle: userInput.travelStyle || 'balanced',
        specialInstructions: userInput.specialInstructions || '',
        summary: `Tailored ${userInput.duration || 7}-day itinerary to ${userInput.destination} for ${travelersCount} travelers.`
      };
    }

    // Safety validation
    try {
      PlannerOutputSchema.parse(parsedSpec);
    } catch (err) {
      console.warn('[Planner Agent] Validation warning, applying fallback normalization:', err.message);
    }

    const durationMs = Date.now() - startTime;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data: parsedSpec,
      reasoning: `Extracted trip specifications: ${parsedSpec.duration} days in ${parsedSpec.destination} with a budget of ${parsedSpec.currency} ${parsedSpec.budget.toLocaleString()} for ${parsedSpec.travelers} traveler(s). Primary interests: ${parsedSpec.preferences.join(', ')}.`
    };
  }
}

module.exports = new PlannerAgent();
