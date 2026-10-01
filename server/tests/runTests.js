const tripOrchestrator = require('../orchestration/tripOrchestrator');
const validatorAgent = require('../agents/validatorAgent');
const budgetAgent = require('../agents/budgetAgent');
const flightService = require('../services/flightService');
const hotelService = require('../services/hotelService');

async function runAllTests() {
  console.log('\n==========================================');
  console.log('🧪 RUNNING AI TRAVELOPS MULTI-AGENT TESTS');
  console.log('==========================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  try {
    // Test 1: Flight Service Search
    console.log('\n--- 1. Testing Flight Service ---');
    const flights = await flightService.searchFlights({
      origin: 'Delhi',
      destination: 'Japan',
      startDate: '2026-04-10',
      endDate: '2026-04-17',
      travelers: 2,
      currency: 'INR'
    });
    assert(flights.options.length > 0, 'Flight Service returns viable airline options');
    assert(flights.selectedOption.totalPrice > 0, 'Flight pricing is calculated accurately');

    // Test 2: Hotel Service Search
    console.log('\n--- 2. Testing Hotel Service ---');
    const hotels = await hotelService.searchHotels({
      destination: 'Japan',
      duration: 7,
      travelers: 2,
      currency: 'INR'
    });
    assert(hotels.options.length > 0, 'Hotel Service returns accommodations');
    assert(hotels.selectedOption.pricePerNight > 0, 'Hotel nightly rate computed properly');

    // Test 3: Budget Agent Computation
    console.log('\n--- 3. Testing Budget Agent ---');
    const mockState = {
      request: { budget: 200000, duration: 7, travelers: 2, destination: 'Japan', currency: 'INR' },
      flights: flights,
      hotels: hotels,
      activities: [{ totalCost: 15000 }],
      transportation: { totalCost: 18000 }
    };
    const budgetRes = await budgetAgent.run(mockState);
    assert(budgetRes.data.totalCost > 0, 'Budget Agent computes aggregate trip expense');
    assert(budgetRes.data.breakdown.length === 6, 'Budget Agent provides 6-category cost breakdown');

    // Test 4: Validator Agent Verification
    console.log('\n--- 4. Testing Validator Agent ---');
    const valState = {
      ...mockState,
      budget: budgetRes.data,
      itinerary: {
        days: [
          { day: 1, timeline: [{ category: 'Transit' }] },
          { day: 2, timeline: [{ category: 'Culture' }] },
          { day: 3, timeline: [{ category: 'Nature' }] },
          { day: 4, timeline: [{ category: 'Food' }] },
          { day: 5, timeline: [{ category: 'Shopping' }] },
          { day: 6, timeline: [{ category: 'Sightseeing' }] },
          { day: 7, timeline: [{ category: 'Transit' }] }
        ]
      }
    };
    const valRes = await validatorAgent.run(valState);
    assert(typeof valRes.data.valid === 'boolean', 'Validator Agent executes constraint audit');
    assert(valRes.data.score >= 50, 'Validator computes quality assurance score');

    // Test 5: Full Multi-Agent Orchestration & Replanning Loop
    console.log('\n--- 5. Testing Multi-Agent Orchestration End-to-End ---');
    const fullTrip = await tripOrchestrator.orchestrateTrip({
      destination: 'Paris',
      origin: 'Delhi',
      duration: 5,
      travelers: 2,
      budget: 180000,
      currency: 'INR',
      preferences: ['culture', 'romantic', 'food'],
      travelStyle: 'balanced'
    });

    assert(fullTrip.title.includes('Paris'), 'Master Planner correctly configured Paris trip');
    assert(fullTrip.agentLogs.length >= 8, 'All specialized agents executed in orchestrator');
    assert(fullTrip.itinerary.days.length === 5, 'Itinerary Agent built complete 5-day schedule');
    assert(fullTrip.validation.score > 0, 'Validator agent reviewed and scored final itinerary');

    console.log('\n==========================================');
    console.log(`🎉 TEST SUMMARY: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
    console.log('==========================================\n');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runAllTests();
