const axios = require("axios");
const CurrencyService = require("./currencyService");

class HotelService {
  static BASE_URL = "https://api.liteapi.travel/v3.0";

  static async getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-API-Key": process.env.LITEAPI_API_KEY,
    };
  }

  /**
   * Search hotels
   */
  static async searchHotels({
    destination,
    startDate,
    endDate,
    duration = 5,
    travelers = 1,
    travelStyle = "balanced",
    currency = "INR",
    budget = 200000,
  }) {
    try {
      if (!process.env.LITEAPI_API_KEY) {
        throw new Error(
          "LITEAPI_API_KEY is not configured"
        );
      }

      // -----------------------------------------
      // 1. Get destination coordinates
      // -----------------------------------------

      const locationResponse = await axios.get(
        `${this.BASE_URL}/data/locations`,
        {
          params: {
            text: destination,
          },
          headers: await this.getHeaders(),
        }
      );

      const locations =
        locationResponse.data?.locations || [];

      if (!locations.length) {
        throw new Error(
          `Could not find destination: ${destination}`
        );
      }

      const location = locations[0];

      // -----------------------------------------
      // 2. Determine dates
      // -----------------------------------------

      const checkIn =
        startDate ||
        this.getDateFromToday(7);

      const checkOut =
        endDate ||
        this.getDateFromToday(
          7 + Math.max(1, duration - 1)
        );

      // -----------------------------------------
      // 3. Search hotels
      // -----------------------------------------

      const response = await axios.post(
        `${this.BASE_URL}/hotels/search`,
        {
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 20,
          },

          checkin: checkIn,

          checkout: checkOut,

          occupancies: [
            {
              adults: travelers,
              children: [],
            },
          ],

          currency: currency,

          guestNationality: "IN",

          roomMapping: true,

          maxRooms: 1,

          limit: 20,
        },
        {
          headers: await this.getHeaders(),
        }
      );

      const hotels =
        response.data?.data || [];

      // -----------------------------------------
      // 4. Convert API response
      // -----------------------------------------

      const options = hotels
        .map((hotel, index) =>
          this.normalizeHotel(
            hotel,
            index,
            currency,
            travelStyle,
            budget
          )
        )
        .filter(Boolean);

      // -----------------------------------------
      // 5. Sort according to travel style
      // -----------------------------------------

      const sortedOptions =
        this.sortHotels(
          options,
          travelStyle
        );

      const selectedHotel =
        sortedOptions[0] || null;

      return {
        options: sortedOptions,

        selectedOption: selectedHotel,

        totalNights:
          this.calculateNights(
            checkIn,
            checkOut
          ),

        destination,

        checkIn,

        checkOut,

        currency,

        provider: "LiteAPI",

        isDemoData: false,
      };
    } catch (error) {
      console.error(
        "Hotel API Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Hotel search failed: ${
          error.response?.data?.message ||
          error.message
        }`
      );
    }
  }

  /**
   * Normalize provider hotel data
   */
  static normalizeHotel(
    hotel,
    index,
    currency,
    travelStyle,
    budget
  ) {
    if (!hotel) return null;

    const price =
      hotel.price?.amount ||
      hotel.minRate ||
      hotel.price ||
      0;

    if (!price) return null;

    const rating =
      hotel.rating ||
      hotel.stars ||
      0;

    const name =
      hotel.name ||
      "Hotel";

    const location =
      hotel.address ||
      hotel.city ||
      "Unknown location";

    const amenities =
      hotel.facilities ||
      hotel.amenities ||
      [];

    return {
      id:
        hotel.id ||
        hotel.hotelId ||
        `HOTEL-${index + 1}`,

      name,

      location,

      rating,

      stars:
        hotel.stars || null,

      amenities,

      pricePerNight:
        Number(price),

      totalPrice:
        Number(price),

      currency,

      provider: "LiteAPI",

      isRecommended:
        this.isRecommendedHotel(
          hotel,
          travelStyle,
          budget
        ),

      isDemoData: false,
    };
  }

  /**
   * Decide which hotel fits the user's style
   */
  static isRecommendedHotel(
    hotel,
    travelStyle,
    budget
  ) {
    const price =
      Number(
        hotel.price?.amount ||
          hotel.minRate ||
          hotel.price ||
          0
      );

    if (!price) return false;

    if (travelStyle === "budget") {
      return price <= budget;
    }

    if (travelStyle === "luxury") {
      return (
        (hotel.stars || 0) >= 4
      );
    }

    return true;
  }

  /**
   * Sort hotels according to travel style
   */
  static sortHotels(
    hotels,
    travelStyle
  ) {
    return [...hotels].sort(
      (a, b) => {
        if (
          travelStyle === "budget"
        ) {
          return (
            a.pricePerNight -
            b.pricePerNight
          );
        }

        if (
          travelStyle === "luxury"
        ) {
          return (
            b.rating -
            a.rating
          );
        }

        return (
          b.rating -
          a.rating
        );
      }
    );
  }

  /**
   * Calculate number of nights
   */
  static calculateNights(
    checkIn,
    checkOut
  ) {
    const start =
      new Date(checkIn);

    const end =
      new Date(checkOut);

    const difference =
      end.getTime() -
      start.getTime();

    return Math.max(
      1,
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      )
    );
  }

  /**
   * Generate date N days from today
   */
  static getDateFromToday(
    days
  ) {
    const date =
      new Date();

    date.setDate(
      date.getDate() + days
    );

    return date
      .toISOString()
      .split("T")[0];
  }
}

module.exports = HotelService;