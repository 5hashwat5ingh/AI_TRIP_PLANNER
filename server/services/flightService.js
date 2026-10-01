const axios = require("axios");
const CurrencyService = require("./currencyService");

class FlightService {
  static BASE_URL = "https://api.duffel.com";

  static getHeaders() {
    if (!process.env.DUFFEL_ACCESS_TOKEN) {
      throw new Error(
        "DUFFEL_ACCESS_TOKEN is not configured"
      );
    }

    return {
      Authorization: `Bearer ${process.env.DUFFEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Duffel-Version": "v2",
    };
  }

  /**
   * Search real flights through Duffel
   */
  static async searchFlights({
    origin,
    destination,
    startDate,
    endDate,
    travelers = 1,
    travelStyle = "balanced",
    currency = "INR",
    budget = 200000,
  }) {
    try {
      // ----------------------------------------
      // 1. Convert passenger count
      // ----------------------------------------

      const count =
        typeof travelers === "object"
          ? travelers.total || travelers.adults || 1
          : Number(travelers) || 1;

      // ----------------------------------------
      // 2. Convert cities/airports to IATA
      // ----------------------------------------

      const originCode =
        await this.getAirportCode(origin);

      const destinationCode =
        await this.getAirportCode(destination);

      // ----------------------------------------
      // 3. Determine cabin
      // ----------------------------------------

      const cabinClass =
        this.getCabinClass(travelStyle);

      // ----------------------------------------
      // 4. Create passengers
      // ----------------------------------------

      const passengers = Array.from(
        { length: count },
        () => ({
          type: "adult",
        })
      );

      // ----------------------------------------
      // 5. Create flight slices
      // ----------------------------------------

      const slices = [
        {
          origin: originCode,
          destination: destinationCode,
          departure_date: startDate,
        },
      ];

      // Add return flight if endDate exists
      if (endDate) {
        slices.push({
          origin: destinationCode,
          destination: originCode,
          departure_date: endDate,
        });
      }

      // ----------------------------------------
      // 6. Create Duffel offer request
      // ----------------------------------------

      const requestBody = {
        data: {
          slices,

          passengers,

          cabin_class: cabinClass,

          // Keep connections reasonable
          max_connections: 1,
        },
      };

      const response = await axios.post(
        `${this.BASE_URL}/air/offer_requests`,
        requestBody,
        {
          headers: this.getHeaders(),
          params: {
            return_offers: true,
            view: "offers",
            supplier_timeout: 10000,
          },

          // Give Duffel enough time to respond
          timeout: 15000,
        }
      );

      const offers =
        response.data?.data?.offers || [];

      // ----------------------------------------
      // 7. Normalize Duffel results
      // ----------------------------------------

      const options = offers
        .map((offer) =>
          this.normalizeOffer(
            offer,
            currency
          )
        )
        .filter(Boolean);

      // ----------------------------------------
      // 8. Sort according to travel style
      // ----------------------------------------

      const sortedOptions =
        this.sortFlights(
          options,
          travelStyle
        );

      // ----------------------------------------
      // 9. Select best option
      // ----------------------------------------

      const selectedFlight =
        this.selectFlight(
          sortedOptions,
          travelStyle,
          budget
        );

      return {
        options: sortedOptions,

        selectedOption:
          selectedFlight,

        travelersCount: count,

        route:
          `${origin} ⇄ ${destination}`,

        originCode,

        destinationCode,

        currency,

        provider: "Duffel",

        offerRequestId:
          response.data?.data?.id || null,

        isDemoData: false,
      };
    } catch (error) {
      console.error(
        "Duffel Flight API Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Flight search failed: ${
          error.response?.data?.errors?.[0]
            ?.message ||
          error.message
        }`
      );
    }
  }

  /**
   * Convert city/airport name to IATA code.
   *
   * For production, connect this to an airport
   * database or your Places/airport service.
   */
  static async getAirportCode(location) {
    const airportMap = {
      delhi: "DEL",
      "new delhi": "DEL",

      mumbai: "BOM",

      bangalore: "BLR",
      bengaluru: "BLR",

      hyderabad: "HYD",

      chennai: "MAA",

      kolkata: "CCU",

      pune: "PNQ",

      goa: "GOI",

      jaipur: "JAI",

      lucknow: "LKO",

      varanasi: "VNS",

      tokyo: "TYO",

      paris: "PAR",

      london: "LON",

      dubai: "DXB",

      singapore: "SIN",

      bangkok: "BKK",

      bali: "DPS",
    };

    const normalized =
      String(location)
        .trim()
        .toLowerCase();

    if (airportMap[normalized]) {
      return airportMap[normalized];
    }

    // If user already supplied an IATA code
    if (/^[A-Z]{3}$/i.test(normalized)) {
      return normalized.toUpperCase();
    }

    throw new Error(
      `Unable to find airport code for: ${location}`
    );
  }

  /**
   * Convert travel style to Duffel cabin
   */
  static getCabinClass(travelStyle) {
    switch (travelStyle) {
      case "luxury":
        return "business";

      case "comfort":
        return "premium_economy";

      case "budget":
      case "balanced":
      default:
        return "economy";
    }
  }

  /**
   * Convert Duffel offer into our application's format
   */
  static normalizeOffer(
    offer,
    currency
  ) {
    try {
      if (!offer) return null;

      const slices =
        offer.slices || [];

      if (!slices.length) {
        return null;
      }

      const normalizedSlices =
        slices.map((slice) => {
          const segments =
            slice.segments || [];

          const firstSegment =
            segments[0];

          const lastSegment =
            segments[
              segments.length - 1
            ];

          if (
            !firstSegment ||
            !lastSegment
          ) {
            return null;
          }

          return {
            originCode:
              firstSegment.origin?.iata_code,

            destinationCode:
              lastSegment.destination
                ?.iata_code,

            departureTime:
              firstSegment.departing_at,

            arrivalTime:
              lastSegment.arriving_at,

            duration:
              slice.duration || null,

            stops:
              Math.max(
                0,
                segments.length - 1
              ),

            segments:
              segments.map(
                (segment) => ({
                  airline:
                    segment
                      .operating_carrier
                      ?.name,

                  airlineCode:
                    segment
                      .operating_carrier
                      ?.iata_code,

                  flightNumber:
                    segment
                      .operating_carrier_flight_number,

                  origin:
                    segment.origin
                      ?.iata_code,

                  destination:
                    segment.destination
                      ?.iata_code,

                  departure:
                    segment.departing_at,

                  arrival:
                    segment.arriving_at,
                })
              ),
          };
        });

      return {
        id: offer.id,

        airline:
          normalizedSlices[0]
            ?.segments?.[0]
            ?.airline ||
          "Unknown Airline",

        flightNumber:
          normalizedSlices[0]
            ?.segments?.[0]
            ?.flightNumber ||
          null,

        slices:
          normalizedSlices.filter(Boolean),

        outbound:
          normalizedSlices[0] || null,

        returnFlight:
          normalizedSlices[1] || null,

        cabinClass:
          offer.slices?.[0]
            ?.segments?.[0]
            ?.passengers?.[0]
            ?.cabin_class ||
          "economy",

        pricePerTraveler:
          this.calculatePerTravelerPrice(
            offer.total_amount,
            offer.total_currency,
            offer.passengers?.length ||
              1,
            currency
          ),

        totalPrice:
          offer.total_amount,

        originalCurrency:
          offer.total_currency,

        currency,

        expiresAt:
          offer.expires_at || null,

        conditions:
          offer.conditions || null,

        emissionsKg:
          offer.total_emissions_kg ||
          null,

        isDemoData: false,
      };
    } catch (error) {
      console.error(
        "Offer normalization error:",
        error.message
      );

      return null;
    }
  }

  /**
   * Convert price to requested currency
   */
  static calculatePerTravelerPrice(
    amount,
    originalCurrency,
    travelerCount,
    targetCurrency
  ) {
    const numericAmount =
      Number(amount);

    if (!numericAmount) {
      return 0;
    }

    const converted =
      CurrencyService.convert(
        numericAmount,
        originalCurrency,
        targetCurrency
      );

    return Math.round(
      converted /
        Math.max(
          1,
          travelerCount
        )
    );
  }

  /**
   * Sort flight results
   */
  static sortFlights(
    flights,
    travelStyle
  ) {
    return [...flights].sort(
      (a, b) => {
        if (
          travelStyle === "budget"
        ) {
          return (
            a.pricePerTraveler -
            b.pricePerTraveler
          );
        }

        if (
          travelStyle === "luxury"
        ) {
          return (
            this.getStops(a) -
            this.getStops(b)
          );
        }

        return (
          this.getStops(a) -
          this.getStops(b)
        );
      }
    );
  }

  /**
   * Select recommended flight
   */
  static selectFlight(
    flights,
    travelStyle,
    budget
  ) {
    if (!flights.length) {
      return null;
    }

    if (
      travelStyle === "budget"
    ) {
      return (
        flights.find(
          (flight) =>
            Number(
              flight.totalPrice
            ) <= budget
        ) ||
        flights[0]
      );
    }

    if (
      travelStyle === "luxury"
    ) {
      return (
        flights.find(
          (flight) =>
            flight.cabinClass ===
            "business"
        ) ||
        flights[0]
      );
    }

    return flights[0];
  }

  /**
   * Get total number of stops
   */
  static getStops(flight) {
    return (
      (flight.outbound?.stops ||
        0) +
      (flight.returnFlight?.stops ||
        0)
    );
  }
}

module.exports = FlightService;