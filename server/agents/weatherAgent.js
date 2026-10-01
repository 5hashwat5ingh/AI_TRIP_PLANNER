const weatherService = require('../services/weatherService');

class WeatherAgent {
  constructor() {
    this.name = 'Weather Agent';
    this.role = 'Meteorological Analyst & Schedule Advisor';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;

    const weatherData = await weatherService.getForecast({
      destination: req.destination,
      startDate: req.startDate,
      duration: req.duration || 7
    });

    const durationMs = Date.now() - startTime;

    const clearDays = weatherData.forecast.filter(f => f.rainProbability < 20).map(f => `Day ${f.day}`);
    const reasoning = `Forecast analysis for ${req.destination}: Overall ${weatherData.overallClimate} (Avg ${weatherData.averageTempC}°C). Best days for panoramic outdoor sightseeing: ${clearDays.join(', ')}. ${weatherData.advisory}`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data: weatherData,
      reasoning
    };
  }
}

module.exports = new WeatherAgent();
