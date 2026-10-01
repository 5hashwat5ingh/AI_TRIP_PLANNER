// ============================================================================
// AI TRAVELOPS - SERVER
// Multi-Agent Travel Planner Backend
// ============================================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database
const { connectDB } = require("./config/db");

// Error handling
const {
  errorHandler,
  notFound,
} = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

// ============================================================================
// APP INITIALIZATION
// ============================================================================

const app = express();


// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT = process.env.PORT || 5000;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


// ============================================================================
// MIDDLEWARES
// ============================================================================

// CORS
app.use(
  cors({
    origin: CLIENT_URL === "*" ? "*" : CLIENT_URL,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);


// JSON body parser
app.use(
  express.json({
    limit: "10mb",
  })
);


// URL encoded body parser
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// ============================================================================
// REQUEST LOGGER
// ============================================================================

app.use((req, res, next) => {
  const startTime = Date.now();

  console.log(
    `[HTTP] ${req.method} ${req.originalUrl}`
  );

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});


// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,

    status: "online",

    system: "AI TravelOps Multi-Agent Engine",

    version: "1.0.0",

    timestamp: new Date().toISOString(),

    agents: [
      "Master Planner",
      "Flight Agent",
      "Hotel Agent",
      "Activity Agent",
      "Transportation Agent",
      "Weather Agent",
      "Budget Agent",
      "Itinerary Agent",
      "Validator Agent",
    ],

    services: {
      database: "MongoDB",
      ai: process.env.OPENAI_MODEL || "configured model",
      flights: process.env.FLIGHT_PROVIDER || "not configured",
      hotels: process.env.HOTEL_PROVIDER || "not configured",
      weather: process.env.WEATHER_PROVIDER || "not configured",
      maps: process.env.MAPS_PROVIDER || "not configured",
      currency: process.env.CURRENCY_PROVIDER || "not configured",
    },
  });
});


// ============================================================================
// API ROUTES
// ============================================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);


// Trips
app.use(
  "/api/trips",
  tripRoutes
);


// ============================================================================
// ROOT ROUTE
// ============================================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "AI TravelOps API is running",

    documentation: {
      health: "/api/health",
      auth: "/api/auth",
      trips: "/api/trips",
    },
  });
});


// ============================================================================
// 404 HANDLER
// ============================================================================

app.use(notFound);


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use(errorHandler);


// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {
  try {
    // ------------------------------------------------------------
    // Validate important environment variables
    // ------------------------------------------------------------

    const requiredEnvironmentVariables = [
      "MONGODB_URI","LITEAPI_API_KEY",
      "JWT_SECRET",
    ];

    const missingVariables =
      requiredEnvironmentVariables.filter(
        (variable) => !process.env[variable]
      );

    if (missingVariables.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVariables.join(
          ", "
        )}`
      );
    }


    // ------------------------------------------------------------
    // Connect MongoDB
    // ------------------------------------------------------------

    await connectDB();

    console.log("✅ MongoDB connection established");


    // ------------------------------------------------------------
    // Start Express server
    // ------------------------------------------------------------

    const server = app.listen(PORT, () => {
      console.log("");
      console.log(
        "======================================================"
      );
      console.log(
        "🚀 AI TravelOps Server Started"
      );
      console.log(
        "======================================================"
      );
      console.log(
        `🌐 Server: http://localhost:${PORT}`
      );
      console.log(
        `❤️  Health: http://localhost:${PORT}/api/health`
      );
      console.log(
        `🔐 Auth: http://localhost:${PORT}/api/auth`
      );
      console.log(
        `✈️  Trips: http://localhost:${PORT}/api/trips`
      );
      console.log(
        `🤖 AI Model: ${
          process.env.OPENAI_MODEL || "Not configured"
        }`
      );
      console.log(
        `✈️  Flight Provider: ${
          process.env.FLIGHT_PROVIDER || "Not configured"
        }`
      );
      console.log(
        `🏨 Hotel Provider: ${
          process.env.HOTEL_PROVIDER || "Not configured"
        }`
      );
      console.log(
        `🌤️  Weather Provider: ${
          process.env.WEATHER_PROVIDER || "Not configured"
        }`
      );
      console.log(
        `🗺️  Maps Provider: ${
          process.env.MAPS_PROVIDER || "Not configured"
        }`
      );
      console.log(
        `💱 Currency Provider: ${
          process.env.CURRENCY_PROVIDER || "Not configured"
        }`
      );
      console.log(
        "======================================================"
      );
      console.log(
        "🤖 Multi-Agent Orchestration Ready"
      );
      console.log(
        "======================================================"
      );
      console.log("");
    });


    // ------------------------------------------------------------
    // Graceful shutdown
    // ------------------------------------------------------------

    const shutdown = (signal) => {
      console.log(
        `\n🛑 ${signal} received. Shutting down server...`
      );

      server.close(() => {
        console.log(
          "✅ HTTP server closed."
        );

        process.exit(0);
      });
    };


    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );


  } catch (error) {
    console.error("");
    console.error(
      "❌ Failed to start AI TravelOps server"
    );
    console.error(
      "------------------------------------------------------"
    );
    console.error(error.message);
    console.error(
      "------------------------------------------------------"
    );

    process.exit(1);
  }
};


// ============================================================================
// START APPLICATION
// ============================================================================

startServer();


// ============================================================================
// EXPORT APP
// ============================================================================

module.exports = app;