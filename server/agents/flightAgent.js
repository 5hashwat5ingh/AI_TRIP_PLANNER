const flightService = require('../services/flightService');

class FlightAgent {
  constructor() {
    this.name = 'Flight Agent';
    this.role = 'Aviation Route & Fare Optimizer';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;

    // Call flight search service
    const flightResults = await flightService.searchFlights({
      origin: req.origin,
      destination: req.destination,
      startDate: req.startDate,
      endDate: req.endDate,
      travelers: req.travelers,
      travelStyle: req.travelStyle,
      currency: req.currency,
      budget: req.budget
    });

    const durationMs = Date.now() - startTime;
    const selected = flightResults.selectedOption;

    const reasoning = `Selected ${selected.airline} (${selected.cabinClass}) for ${flightResults.travelersCount} traveler(s). Total flight cost: ${selected.currency} ${selected.totalPrice.toLocaleString()}. Chosen for optimal duration (${selected.outbound.duration}) and competitive schedule.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data: flightResults,
      reasoning
    };
  }
}

module.exports = new FlightAgent();
