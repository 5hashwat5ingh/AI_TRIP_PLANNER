const express = require("express");

const router = express.Router();

// Trip controllers
const {
  generateTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  modifyTrip,
  replanTrip,
  getSharedTrip,
} = require("../controllers/tripController");

// Authentication middleware
const { optionalAuth } = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| TRIP ROUTES
|--------------------------------------------------------------------------
|
| Base route:
| /api/trips
|
| These routes support both:
| - Guest users
| - Authenticated users
|
|--------------------------------------------------------------------------
*/


// -----------------------------------------------------------------------
// CREATE / GENERATE TRIP
// POST /api/trips
// -----------------------------------------------------------------------
router.post("/", optionalAuth, generateTrip);


// -----------------------------------------------------------------------
// GET USER TRIPS
// GET /api/trips
// -----------------------------------------------------------------------
router.get("/", optionalAuth, getUserTrips);


// -----------------------------------------------------------------------
// GET SHARED TRIP
// GET /api/trips/share/:shareId
//
// This route is intentionally placed BEFORE /:id so that
// "share" is not interpreted as a trip ID.
// -----------------------------------------------------------------------
router.get("/share/:shareId", getSharedTrip);


// -----------------------------------------------------------------------
// GET SINGLE TRIP
// GET /api/trips/:id
// -----------------------------------------------------------------------
router.get("/:id", optionalAuth, getTripById);


// -----------------------------------------------------------------------
// UPDATE TRIP
// PUT /api/trips/:id
// -----------------------------------------------------------------------
router.put("/:id", optionalAuth, updateTrip);


// -----------------------------------------------------------------------
// DELETE TRIP
// DELETE /api/trips/:id
// -----------------------------------------------------------------------
router.delete("/:id", optionalAuth, deleteTrip);


// -----------------------------------------------------------------------
// MODIFY TRIP
// POST /api/trips/:id/modify
// -----------------------------------------------------------------------
router.post("/:id/modify", optionalAuth, modifyTrip);


// -----------------------------------------------------------------------
// REPLAN TRIP
// POST /api/trips/:id/replan
// -----------------------------------------------------------------------
router.post("/:id/replan", optionalAuth, replanTrip);


// -----------------------------------------------------------------------
// EXPORT ROUTER
// -----------------------------------------------------------------------
module.exports = router;