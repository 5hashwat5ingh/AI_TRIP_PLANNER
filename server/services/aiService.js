const axios = require("axios");

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";

    this.model =
      process.env.GROQ_MODEL ||
      "llama-3.3-70b-versatile";

    if (!this.apiKey) {
      console.warn(
        "[Groq AI Service] GROQ_API_KEY is not configured."
      );
    }
  }

  /**
   * Generate structured JSON using Groq
   */
  async generateStructuredJSON({
    systemPrompt,
    userPrompt,
    schema,
    temperature = 0.7,
  }) {
    if (!this.apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured"
      );
    }

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: this.model,

          messages: [
            {
              role: "system",
              content: `
${systemPrompt}

You are part of the AI TravelOps multi-agent system.

Return ONLY valid JSON.

Do not:
- use Markdown
- wrap JSON in code fences
- add explanations
- add comments
- invent unavailable external API data

The response must follow the requested schema.
              `.trim(),
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],

          response_format: {
            type: "json_object",
          },

          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },

          timeout: 30000,
        }
      );

      const content =
        response.data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(
          "Groq returned an empty response"
        );
      }

      let parsed;

      try {
        parsed = JSON.parse(content);
      } catch (error) {
        throw new Error(
          "Groq returned invalid JSON"
        );
      }

      // Optional schema validation
      if (schema) {
        return this.validateSchema(
          parsed,
          schema
        );
      }

      return parsed;

    } catch (error) {
      console.error(
        "[Groq AI Service] API error:",
        error.response?.data ||
          error.message
      );

      // No mock/fallback engine
      throw error;
    }
  }

  /**
   * Validate generated output
   *
   * Supports:
   * - Zod schemas
   * - Custom validation functions
   */
  validateSchema(data, schema) {

    // Zod-style schema
    if (
      typeof schema.safeParse ===
      "function"
    ) {
      const result =
        schema.safeParse(data);

      if (!result.success) {
        console.error(
          "[Groq AI Service] Schema validation failed:",
          result.error
        );

        throw new Error(
          "Groq response failed schema validation"
        );
      }

      return result.data;
    }

    // Custom validation function
    if (
      typeof schema === "function"
    ) {
      const result = schema(data);

      if (result === false) {
        throw new Error(
          "Groq response failed validation"
        );
      }

      return data;
    }

    return data;
  }

  /**
   * Check whether Groq is configured
   */
  isConfigured() {
    return Boolean(
      this.apiKey &&
      this.apiKey.trim()
    );
  }

  /**
   * Get currently configured Groq model
   */
  getModel() {
    return this.model;
  }
}

module.exports = new AIService();