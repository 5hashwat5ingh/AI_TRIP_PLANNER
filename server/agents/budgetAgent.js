const CurrencyService = require('../services/currencyService');

class BudgetAgent {
  constructor() {
    this.name = 'Budget Agent';
    this.role = 'Financial Auditor & Cost Optimizer';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;
    const travelers = req.travelers || 1;
    const duration = req.duration || 7;
    const currency = req.currency || 'INR';
    const userBudget = Number(req.budget) || 200000;

    // 1. Flight Cost
    const flightCost = sharedState.flights?.selectedOption?.totalPrice || 
      (sharedState.flights?.options?.[0]?.totalPrice || 0);

    // 2. Hotel Cost
    const hotelCost = sharedState.hotels?.selectedOption?.totalPrice || 
      (sharedState.hotels?.options?.[0]?.totalPrice || 0);

    // 3. Activity Cost
    const activityCost = Array.isArray(sharedState.activities) 
      ? sharedState.activities.reduce((sum, a) => sum + (a.totalCost || 0), 0)
      : (sharedState.activities?.totalActivityCost || 0);

    // 4. Transportation Cost
    const transportCost = sharedState.transportation?.totalCost || 
      sharedState.transportation?.data?.totalCost || 0;

    // 5. Daily Food & Dining Estimate
    const isDomestic = req.destination.toLowerCase().includes('goa') || req.destination.toLowerCase().includes('manali');
    const foodDailyINR = isDomestic
      ? (req.travelStyle === 'luxury' ? 3500 : req.travelStyle === 'budget' ? 800 : 1800)
      : (req.travelStyle === 'luxury' ? 8500 : req.travelStyle === 'budget' ? 2200 : 4200);

    const foodCostPerPerson = CurrencyService.convert(foodDailyINR * duration, 'INR', currency);
    const foodCost = foodCostPerPerson * travelers;

    // 6. Miscellaneous & Buffer
    const miscCost = Math.round((flightCost + hotelCost + activityCost + transportCost + foodCost) * 0.05);

    // Total Cost
    const totalCost = flightCost + hotelCost + activityCost + transportCost + foodCost + miscCost;
    const remainingBudget = userBudget - totalCost;
    const withinBudget = totalCost <= userBudget;

    // Calculate percentage breakdown for Recharts
    const breakdown = [
      { name: 'Flights', value: flightCost, percentage: Math.round((flightCost / totalCost) * 100) || 0, color: '#36a8f6' },
      { name: 'Hotels', value: hotelCost, percentage: Math.round((hotelCost / totalCost) * 100) || 0, color: '#10b981' },
      { name: 'Food & Dining', value: foodCost, percentage: Math.round((foodCost / totalCost) * 100) || 0, color: '#f59e0b' },
      { name: 'Activities', value: activityCost, percentage: Math.round((activityCost / totalCost) * 100) || 0, color: '#8b5cf6' },
      { name: 'Transport', value: transportCost, percentage: Math.round((transportCost / totalCost) * 100) || 0, color: '#06b6d4' },
      { name: 'Buffer / Misc', value: miscCost, percentage: Math.round((miscCost / totalCost) * 100) || 0, color: '#64748b' }
    ];

    const durationMs = Date.now() - startTime;

    const data = {
      flightCost,
      hotelCost,
      activityCost,
      transportCost,
      foodCost,
      miscellaneous: miscCost,
      totalCost,
      userBudget,
      remainingBudget,
      withinBudget,
      currency,
      formattedTotal: CurrencyService.format(totalCost, currency),
      formattedBudget: CurrencyService.format(userBudget, currency),
      formattedRemaining: CurrencyService.format(Math.abs(remainingBudget), currency),
      breakdown
    };

    let reasoning = withinBudget 
      ? `Trip plan is strictly within your allocated budget of ${data.formattedBudget}. Total estimated outlay: ${data.formattedTotal} (Leaving a comfortable cushion of ${data.formattedRemaining}).`
      : `Budget alert: Estimated cost ${data.formattedTotal} exceeds budget of ${data.formattedBudget} by ${data.formattedRemaining}. Adjusting accommodation and flight tier candidates during replanning.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data,
      reasoning
    };
  }
}

module.exports = new BudgetAgent();
