const CurrencyService = require('../services/currencyService');

class TransportationAgent {
  constructor() {
    this.name = 'Transportation Agent';
    this.role = 'Local & Regional Transit Strategist';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;
    const destLower = req.destination.toLowerCase();
    const duration = req.duration || 7;
    const travelers = req.travelers || 1;

    let transitModes = [];
    let passName = 'Unlimited City Transit & Metro Pass';
    let baseTransitCostINR = 2500 * duration;

    if (destLower.includes('japan') || destLower.includes('tokyo')) {
      passName = duration >= 6 ? '7-Day JR Whole Japan / Regional Shinkansen & Tokyo Subway Pass' : 'Tokyo Subway 72hr + Suica IC Card';
      baseTransitCostINR = duration >= 6 ? 22000 : 8500;
      transitModes = [
        { mode: 'Shinkansen (Bullet Train)', description: 'High-speed bullet train connectivity between Tokyo, Kyoto, and Osaka (up to 320 km/h).' },
        { mode: 'Tokyo Metro / Toei Subway', description: 'World-class punctual underground network connecting all city wards.' },
        { mode: 'Suica / Pasmo IC Smartcard', description: 'Tap-to-pay contactless transit for all buses, trains, and convenience stores.' }
      ];
    } else if (destLower.includes('paris') || destLower.includes('france')) {
      passName = 'Navigo Easy Pass & RER Regional Pass';
      baseTransitCostINR = 5500;
      transitModes = [
        { mode: 'Paris Metro & RER', description: 'Comprehensive rail coverage to monuments and Palace of Versailles.' },
        { mode: 'Seine Batobus / Walking', description: 'Scenic hop-on river boat and picturesque walkable boulevards.' }
      ];
    } else if (destLower.includes('goa')) {
      passName = 'Private Chauffeur / Self-Drive Rental SUV';
      baseTransitCostINR = 3000 * duration;
      transitModes = [
        { mode: 'Self-Drive Vehicle / Cab', description: 'Flexible exploration across North and South Goa coastal highways.' }
      ];
    } else if (destLower.includes('switzerland')) {
      passName = 'Swiss Travel Pass (All-Inclusive Trains, Boats, Gondolas)';
      baseTransitCostINR = 28000;
      transitModes = [
        { mode: 'Panoramic Alpine Trains', description: 'Scenic glacier routes with unlimited Swiss public transport.' }
      ];
    } else {
      passName = 'City Tourist Transit Card & Rideshare Package';
      baseTransitCostINR = 1800 * duration;
      transitModes = [
        { mode: 'Metro & Local Express Bus', description: 'Fast and convenient transit between major city sights.' }
      ];
    }

    const costPerPerson = CurrencyService.convert(baseTransitCostINR, 'INR', req.currency || 'INR');
    const totalCost = costPerPerson * travelers;

    const durationMs = Date.now() - startTime;

    const data = {
      recommendedPass: passName,
      transitModes,
      costPerPerson,
      totalCost,
      currency: req.currency || 'INR',
      airportTransfer: {
        mode: 'Express Airport Train / Private Taxi',
        durationMinutes: 45,
        included: true
      },
      dailyEstimatedTransitMinutes: 45
    };

    const reasoning = `Configured transit strategy with ${passName}. Provides seamless transfers and saves up to 35% compared to individual tickets. Total transit allocation: ${req.currency} ${totalCost.toLocaleString()}.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data,
      reasoning
    };
  }
}

module.exports = new TransportationAgent();
