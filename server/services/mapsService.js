const axios = require("axios");

class MapsService {
  static baseUrl = "https://api.geoapify.com/v1";

  // Geocode a city/address → coordinates
  static async geocode(address) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/geocode/search`,
        {
          params: {
            text: address,
            apiKey: process.env.GEOAPIFY_API_KEY,
            format: "json",
          },
        }
      );

      const result = response.data?.results?.[0];

      if (!result) {
        throw new Error(`Location not found: ${address}`);
      }

      return {
        lat: result.lat,
        lng: result.lon,
        formatted: result.formatted,
        city: result.city || null,
        country: result.country || null,
      };
    } catch (error) {
      console.error("Geoapify Geocoding Error:", error.message);
      throw new Error(`Unable to geocode location: ${address}`);
    }
  }

  // Calculate route between two coordinates
  static async getRoute(
    origin,
    destination,
    mode = "drive"
  ) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/routing`,
        {
          params: {
            waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
            mode,
            apiKey: process.env.GEOAPIFY_API_KEY,
          },
        }
      );

      const route = response.data?.features?.[0];

      if (!route) {
        throw new Error("No route found");
      }

      const properties = route.properties;

      return {
        distanceKm:
          Math.round((properties.distance / 1000) * 10) / 10,

        durationMinutes:
          Math.round(properties.time / 60),

        distanceMeters: properties.distance,

        durationSeconds: properties.time,

        mode,
      };
    } catch (error) {
      console.error("Geoapify Routing Error:", error.message);
      throw new Error("Unable to calculate route");
    }
  }

  // Search nearby places
  static async searchPlaces({
    lat,
    lng,
    categories,
    radius = 5000,
    limit = 10,
  }) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/places`,
        {
          params: {
            categories,
            filter: `circle:${lng},${lat},${radius}`,
            limit,
            apiKey: process.env.GEOAPIFY_API_KEY,
          },
        }
      );

      return response.data.features.map((place) => ({
        id: place.properties.place_id,

        name:
          place.properties.name ||
          "Unnamed place",

        address:
          place.properties.formatted || null,

        lat: place.geometry.coordinates[1],

        lng: place.geometry.coordinates[0],

        categories:
          place.properties.categories || [],

        distance:
          place.properties.distance || null,
      }));
    } catch (error) {
      console.error("Geoapify Places Error:", error.message);
      throw new Error("Unable to search places");
    }
  }

  // Calculate straight-line distance
  static calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ) {
    if (
      lat1 == null ||
      lon1 == null ||
      lat2 == null ||
      lon2 == null
    ) {
      return null;
    }

    const R = 6371;

    const dLat =
      (lat2 - lat1) * (Math.PI / 180);

    const dLon =
      (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return Math.round(R * c * 10) / 10;
  }

  // Map center
  static getMapCenter(locations = []) {
    const valid = locations.filter(
      (location) =>
        location?.lat != null &&
        location?.lng != null
    );

    if (!valid.length) {
      return null;
    }

    const avgLat =
      valid.reduce(
        (sum, location) =>
          sum + location.lat,
        0
      ) / valid.length;

    const avgLng =
      valid.reduce(
        (sum, location) =>
          sum + location.lng,
        0
      ) / valid.length;

    return {
      lat: Math.round(avgLat * 10000) / 10000,
      lng: Math.round(avgLng * 10000) / 10000,
    };
  }
}

module.exports = MapsService;