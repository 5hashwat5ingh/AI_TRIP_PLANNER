const placesService = require('../services/placesService');
const CurrencyService = require('../services/currencyService');

class ActivityAgent {
  constructor() {
    this.name = 'Activity Agent';
    this.role = 'Experience Curator & Attraction Matcher';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request || {};

    const duration = Number(req.duration) || 3;
    const travelersCount = Number(req.travelers) || 1;
    const currency = req.currency || 'INR';

    const preferences = Array.isArray(req.preferences)
      ? req.preferences
      : [];

    // Determine attraction search volume based on trip duration
    const targetActivityCount = Math.min(
      18,
      Math.max(6, duration * 2)
    );

    // Search attractions
    const rawResult = await placesService.searchAttractions({
      destination: req.destination,
      preferences,
      maxCount: targetActivityCount
    });

    // Normalize places service response
    let rawAttractions = [];

    if (Array.isArray(rawResult)) {
      rawAttractions = rawResult;
    } else if (Array.isArray(rawResult?.data)) {
      rawAttractions = rawResult.data;
    } else if (Array.isArray(rawResult?.attractions)) {
      rawAttractions = rawResult.attractions;
    } else if (Array.isArray(rawResult?.places)) {
      rawAttractions = rawResult.places;
    }

    console.log(
      `[Activity Agent] Received ${rawAttractions.length} attractions for ${req.destination}`
    );

    // Convert estimated costs to user's currency
    const activities = rawAttractions.map((act, index) => {
      const estimatedCostINR =
        Number(act.estimatedCostINR) || 0;

      const costPerPerson = CurrencyService.convert(
        estimatedCostINR,
        'INR',
        currency
      );

      const totalCost = costPerPerson * travelersCount;

      const category = act.category || 'General';

      return {
        id: `ACT-${index + 1}`,
        name: act.name || 'Unnamed Attraction',
        city: act.city || req.destination,
        area: act.area || '',
        durationHours: Number(act.durationHours) || 2,
        category,
        costPerPerson,
        totalCost,
        currency,

        coordinates: {
          lat: act.lat ?? null,
          lng: act.lng ?? null
        },

        bestTime: act.bestTime || 'Anytime',
        indoor: Boolean(act.indoor),

        highlights: Array.isArray(act.highlights)
          ? act.highlights
          : [],

        preferenceMatched: preferences.some(
          p =>
            String(p).toLowerCase() ===
            String(category).toLowerCase()
        )
      };
    });

    const durationMs = Date.now() - startTime;

    const totalActivityCost = activities.reduce(
      (sum, activity) => sum + activity.totalCost,
      0
    );

    const reasoning = `Curated ${
      activities.length
    } hand-picked experiences aligned with your interests (${
      preferences.length ? preferences.join(', ') : 'general sightseeing'
    }). Total activity admissions: ${currency} ${totalActivityCost.toLocaleString()}.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data: activities,
      totalActivityCost,
      reasoning
    };
  }
}

module.exports = new ActivityAgent();