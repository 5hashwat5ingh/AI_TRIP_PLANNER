const axios = require("axios");

class WeatherService {
  static BASE_URL =
    "https://api.openweathermap.org/data/2.5";

  static getApiKey() {
    const key =
      process.env.OPENWEATHER_API_KEY;

    if (!key) {
      throw new Error(
        "OPENWEATHER_API_KEY is not configured"
      );
    }

    return key;
  }

  // -----------------------------------------
  // Geocode destination
  // -----------------------------------------

  static async geocode(destination) {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: destination,
          limit: 1,
          appid: this.getApiKey(),
        },
      }
    );

    const location =
      response.data?.[0];

    if (!location) {
      throw new Error(
        `Location not found: ${destination}`
      );
    }

    return {
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state || null,
    };
  }

  // -----------------------------------------
  // Get real forecast
  // -----------------------------------------

  static async getForecast({
    destination,
    startDate,
    duration = 5,
  }) {
    try {
      // 1. Find coordinates
      const location =
        await this.geocode(destination);

      // 2. Get forecast
      const response = await axios.get(
        `${this.BASE_URL}/forecast`,
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            units: "metric",
            appid: this.getApiKey(),
          },
        }
      );

      const forecastList =
        response.data?.list || [];

      if (!forecastList.length) {
        throw new Error(
          "No weather forecast available"
        );
      }

      // 3. Group forecast by date
      const grouped =
        this.groupByDate(
          forecastList
        );

      // 4. Convert to daily forecast
      const forecast =
        Object.entries(grouped)
          .slice(0, duration)
          .map(
            ([date, entries], index) =>
              this.buildDailyForecast(
                date,
                entries,
                index + 1
              )
          );

      return {
        destination,

        coordinates: {
          lat: location.lat,
          lon: location.lon,
        },

        overallClimate:
          this.getOverallCondition(
            forecast
          ),

        averageTempC:
          this.getAverageTemperature(
            forecast
          ),

        advisory:
          this.generateAdvisory(
            forecast
          ),

        forecast,

        provider: "OpenWeather",

        isDemoData: false,
      };
    } catch (error) {
      console.error(
        "OpenWeather Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Weather forecast failed: ${
          error.response?.data?.message ||
          error.message
        }`
      );
    }
  }

  // -----------------------------------------
  // Group 3-hour forecasts by date
  // -----------------------------------------

  static groupByDate(
    forecastList
  ) {
    return forecastList.reduce(
      (groups, item) => {
        const date =
          item.dt_txt.split(" ")[0];

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date].push(item);

        return groups;
      },
      {}
    );
  }

  // -----------------------------------------
  // Build daily forecast
  // -----------------------------------------

  static buildDailyForecast(
    date,
    entries,
    day
  ) {
    const temperatures =
      entries.map(
        (entry) =>
          entry.main.temp
      );

    const rainProbabilities =
      entries.map(
        (entry) =>
          (entry.pop || 0) * 100
      );

    const averageTemp =
      temperatures.reduce(
        (sum, temp) =>
          sum + temp,
        0
      ) / temperatures.length;

    const maxRain =
      Math.max(
        ...rainProbabilities
      );

    const representative =
      entries.reduce(
        (current, entry) =>
          (entry.pop || 0) >
          (current.pop || 0)
            ? entry
            : current,
        entries[0]
      );

    const condition =
      representative.weather?.[0]
        ?.description ||
      "Unknown";

    const icon =
      this.mapWeatherIcon(
        representative.weather?.[0]
          ?.main
      );

    const suitableForOutdoor =
      maxRain < 40;

    return {
      day,

      date,

      tempC:
        Math.round(
          averageTemp * 10
        ) / 10,

      tempF:
        Math.round(
          (averageTemp * 9) / 5 +
            32
        ),

      condition,

      rainProbability:
        Math.round(maxRain),

      humidity:
        Math.round(
          entries.reduce(
            (sum, entry) =>
              sum +
              entry.main.humidity,
            0
          ) / entries.length
        ),

      windSpeed:
        Math.round(
          (
            entries.reduce(
              (sum, entry) =>
                sum +
                (entry.wind?.speed ||
                  0),
              0
            ) /
            entries.length
          ) * 10
        ) / 10,

      icon,

      suitableForOutdoor,

      recommendation:
        this.getRecommendation(
          maxRain,
          condition
        ),
    };
  }

  // -----------------------------------------
  // Weather icon
  // -----------------------------------------

  static mapWeatherIcon(
    condition
  ) {
    switch (condition) {
      case "Clear":
        return "Sun";

      case "Clouds":
        return "CloudSun";

      case "Rain":
      case "Drizzle":
        return "CloudRain";

      case "Thunderstorm":
        return "CloudLightning";

      case "Snow":
        return "CloudSnow";

      case "Mist":
      case "Fog":
      case "Haze":
        return "CloudFog";

      default:
        return "Cloud";
    }
  }

  // -----------------------------------------
  // Outdoor recommendation
  // -----------------------------------------

  static getRecommendation(
    rainProbability,
    condition
  ) {
    if (
      rainProbability >= 70
    ) {
      return "High chance of rain. Consider indoor attractions and keep outdoor activities flexible.";
    }

    if (
      rainProbability >= 40
    ) {
      return "Possible rain. Keep an indoor alternative available.";
    }

    if (
      condition
        .toLowerCase()
        .includes("clear")
    ) {
      return "Good conditions for outdoor sightseeing.";
    }

    return "Generally suitable for outdoor activities.";
  }

  // -----------------------------------------
  // Overall condition
  // -----------------------------------------

  static getOverallCondition(
    forecast
  ) {
    if (!forecast.length) {
      return "Unknown";
    }

    const conditions =
      forecast.map(
        (day) => day.condition
      );

    return conditions[0];
  }

  // -----------------------------------------
  // Average temperature
  // -----------------------------------------

  static getAverageTemperature(
    forecast
  ) {
    if (!forecast.length) {
      return null;
    }

    const average =
      forecast.reduce(
        (sum, day) =>
          sum + day.tempC,
        0
      ) / forecast.length;

    return Math.round(
      average * 10
    ) / 10;
  }

  // -----------------------------------------
  // Overall advisory
  // -----------------------------------------

  static generateAdvisory(
    forecast
  ) {
    if (!forecast.length) {
      return "Weather information unavailable.";
    }

    const rainyDays =
      forecast.filter(
        (day) =>
          day.rainProbability >=
          60
      ).length;

    if (
      rainyDays >=
      Math.ceil(
        forecast.length / 2
      )
    ) {
      return "Several days have a high chance of rain. Keep indoor alternatives available.";
    }

    if (rainyDays > 0) {
      return "Some rain is possible during the trip. Keep a flexible itinerary.";
    }

    return "Forecast conditions are generally favorable for outdoor exploration.";
  }
}

module.exports = WeatherService;