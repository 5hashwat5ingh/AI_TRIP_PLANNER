const hotelService = require('../services/hotelService');

class HotelAgent {
  constructor() {
    this.name = 'Hotel Agent';
    this.role = 'Accommodation & Hospitality Specialist';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;

    const hotelResults = await hotelService.searchHotels({
      destination: req.destination,
      duration: req.duration,
      travelers: req.travelers,
      travelStyle: req.travelStyle,
      currency: req.currency,
      budget: req.budget
    });

    const durationMs = Date.now() - startTime;
    const selected = hotelResults.selectedOption;

    const reasoning = `Recommended stay at ${selected.name} (${selected.location}) for ${selected.totalNights} nights. Total: ${selected.currency} ${selected.totalPrice.toLocaleString()} (${selected.rating}★ rating). Centrally located with easy transit connectivity to planned attractions.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data: hotelResults,
      reasoning
    };
  }
}

module.exports = new HotelAgent();
