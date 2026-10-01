const axios = require("axios");

class PlacesService {
  static BASE_URL = "https://api.geoapify.com/v2";

  static getApiKey() {
    const key = process.env.GEOAPIFY_API_KEY;

    if (!key) {
      throw new Error(
        "GEOAPIFY_API_KEY is not configured"
      );
    }

    return key;
  }

  // -----------------------------------------
  // Geocode destination
  // -----------------------------------------

  static async geocode(destination) {
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
          params: {
            text: destination,
            format: "json",
            limit: 1,
            apiKey: this.getApiKey(),
          },
        }
      );

      const result =
        response.data?.results?.[0];

      if (!result) {
        throw new Error(
          `Destination not found: ${destination}`
        );
      }

      return {
        lat: result.lat,
        lng: result.lon,
        city:
          result.city ||
          result.name ||
          destination,
        country:
          result.country || null,
        formatted:
          result.formatted || destination,
      };
    } catch (error) {
      console.error(
        "Geoapify Geocoding Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Unable to locate ${destination}`
      );
    }
  }

  // -----------------------------------------
  // Search real attractions
  // -----------------------------------------

  static async searchAttractions({
    destination,
    preferences = [],
    maxCount = 10,
    radius = 10000,
  }) {
    try {
      const location =
        await this.geocode(destination);

      const categories =
        this.getCategories(preferences);

      const response = await axios.get(
        `${this.BASE_URL}/places`,
        {
          params: {
            categories:
              categories.join(","),

            filter:
              `circle:${location.lng},${location.lat},${radius}`,

            bias:
              `proximity:${location.lng},${location.lat}`,

            limit: maxCount,

            apiKey: this.getApiKey(),
          },
        }
      );

      const features =
        response.data?.features || [];

      return features.map(
        (feature) =>
          this.normalizePlace(feature)
      );
    } catch (error) {
      console.error(
        "Geoapify Places Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Unable to search attractions in ${destination}`
      );
    }
  }

  // -----------------------------------------
  // Map user preferences to Geoapify categories
  // -----------------------------------------

  static getCategories(preferences = []) {
    const categories = new Set();

    const prefs =
      preferences.map((p) =>
        String(p).toLowerCase()
      );

    if (
      prefs.some((p) =>
        [
          "culture",
          "history",
          "heritage",
          "temple",
          "museum",
        ].includes(p)
      )
    ) {
      categories.add(
        "tourism.sights"
      );
    }

    if (
      prefs.some((p) =>
        [
          "nature",
          "mountains",
          "beaches",
          "park",
        ].includes(p)
      )
    ) {
      categories.add(
        "leisure.park"
      );

      categories.add(
        "natural"
      );
    }

    if (
      prefs.some((p) =>
        [
          "food",
          "restaurants",
          "cuisine",
        ].includes(p)
      )
    ) {
      categories.add(
        "catering.restaurant"
      );
    }

    if (
      prefs.some((p) =>
        [
          "nightlife",
          "clubs",
          "bars",
        ].includes(p)
      )
    ) {
      categories.add(
        "catering.bar"
      );
    }

    if (
      prefs.some((p) =>
        [
          "shopping",
          "shopping malls",
        ].includes(p)
      )
    ) {
      categories.add(
        "commercial.shopping_mall"
      );
    }

    // Default
    if (!categories.size) {
      categories.add(
        "tourism.sights"
      );
    }

    return [...categories];
  }

  // -----------------------------------------
  // Normalize Geoapify response
  // -----------------------------------------

  static normalizePlace(feature) {
    const properties =
      feature.properties || {};

    const coordinates =
      feature.geometry?.coordinates || [];

    return {
      id:
        properties.place_id ||
        null,

      name:
        properties.name ||
        "Unnamed place",

      address:
        properties.formatted ||
        null,

      city:
        properties.city ||
        null,

      country:
        properties.country ||
        null,

      category:
        properties.categories?.[0] ||
        "tourism",

      categories:
        properties.categories ||
        [],

      lat:
        coordinates[1] ?? null,

      lng:
        coordinates[0] ?? null,

      distance:
        properties.distance || null,

      website:
        properties.website ||
        null,

      openingHours:
        properties.opening_hours ||
        null,

      phone:
        properties.contact?.phone ||
        null,

      source:
        "Geoapify",

      isDemoData: false,
    };
  }
}

module.exports = PlacesService;