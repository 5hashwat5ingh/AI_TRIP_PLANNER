const axios = require("axios");

class CurrencyService {
  static BASE_URL =
    "https://api.frankfurter.dev/v2";

  static currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AED: "AED ",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    CHF: "CHF ",
  };

  // Cache exchange rates for 1 hour
  static cache = new Map();

  /**
   * Get live exchange rate
   */
  static async getRate(from, to) {
    from = from.toUpperCase();
    to = to.toUpperCase();

    if (from === to) {
      return 1;
    }

    const cacheKey = `${from}_${to}`;

    const cached =
      this.cache.get(cacheKey);

    if (
      cached &&
      Date.now() - cached.timestamp <
        60 * 60 * 1000
    ) {
      return cached.rate;
    }

    try {
      const response =
        await axios.get(
          `${this.BASE_URL}/rate/${from}/${to}`
        );

      const rate =
        Number(response.data?.rate);

      if (!rate || Number.isNaN(rate)) {
        throw new Error(
          `Invalid exchange rate for ${from}/${to}`
        );
      }

      this.cache.set(cacheKey, {
        rate,
        timestamp: Date.now(),
      });

      return rate;
    } catch (error) {
      console.error(
        "Currency API Error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        `Unable to get exchange rate ${from} → ${to}`
      );
    }
  }

  /**
   * Convert currency
   */
  static async convert(
    amount,
    from = "INR",
    to = "INR"
  ) {
    if (amount == null) {
      throw new Error(
        "Amount is required"
      );
    }

    from = from.toUpperCase();
    to = to.toUpperCase();

    if (from === to) {
      return Number(amount);
    }

    const rate =
      await this.getRate(
        from,
        to
      );

    return Math.round(
      Number(amount) * rate
    );
  }

  /**
   * Format currency
   */
  static format(
    amount,
    currency = "INR"
  ) {
    const symbol =
      this.getSymbol(currency);

    return `${symbol}${Number(
      amount
    ).toLocaleString("en-IN")}`;
  }

  /**
   * Get currency symbol
   */
  static getSymbol(
    currency = "INR"
  ) {
    return (
      this.currencySymbols[
        currency.toUpperCase()
      ] || `${currency} `
    );
  }

  /**
   * Get supported currencies
   */
  static async getAllSupportedCurrencies() {
    try {
      const response =
        await axios.get(
          `${this.BASE_URL}/currencies`
        );

      return response.data.map(
        (currency) =>
          currency.iso_code
      );
    } catch (error) {
      console.error(
        "Currency list error:",
        error.message
      );

      throw new Error(
        "Unable to fetch supported currencies"
      );
    }
  }
}

module.exports = CurrencyService;