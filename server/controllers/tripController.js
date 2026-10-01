const tripOrchestrator = require('../orchestration/tripOrchestrator');
const Trip = require('../models/Trip');
const memoryStore = require('../models/memoryStore');
const { isDbConnected } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc   Generate a new trip using Multi-Agent Orchestration
// @route  POST /api/trips
const generateTrip = async (req, res, next) => {
  try {
    const userInput = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : (req.body.userId || 'guest_user_default');

    console.log(`[Trip Controller] Starting Multi-Agent workflow for: ${userInput.destination || userInput.naturalPrompt}`);
    
    // Orchestrate with agents
    const orchestratedTrip = await tripOrchestrator.orchestrateTrip(userInput, { userId });
    
    const tripPayload = {
      ...orchestratedTrip,
      userId: String(userId),
      shareId: uuidv4().substring(0, 8),
      isSaved: false,
    };

    let savedTrip;

    if (isDbConnected()) {
      savedTrip = await Trip.create(tripPayload);
    } else {
      savedTrip = await memoryStore.createTrip(tripPayload);
    }

    return res.status(201).json({
      success: true,
      message: 'Trip orchestrated successfully by AI Agent network',
      trip: savedTrip
    });
  } catch (error) {
    console.error('[Trip Controller Error]', error);
    next(error);
  }
};

// @desc   Get all trips for current user
// @route  GET /api/trips
const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.user ? String(req.user._id || req.user.id) : 'guest_user_default';

    if (isDbConnected()) {
      const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: trips.length, trips });
    }

    const trips = await memoryStore.findTripsByUserId(userId);
    return res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

// @desc   Get trip by ID
// @route  GET /api/trips/:id
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const trip = await Trip.findById(id);
      if (!trip) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      return res.json({ success: true, trip });
    }

    const trip = await memoryStore.findTripById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    return res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc   Update / toggle save trip
// @route  PUT /api/trips/:id
const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isDbConnected()) {
      const updated = await Trip.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, trip: updated });
    }

    const updated = await memoryStore.updateTrip(id, updateData);
    if (!updated) return res.status(404).json({ success: false, message: 'Trip not found' });
    return res.json({ success: true, trip: updated });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a trip
// @route  DELETE /api/trips/:id
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Trip.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Trip not found' });
      return res.json({ success: true, message: 'Trip removed successfully' });
    }

    const deleted = await memoryStore.deleteTrip(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Trip not found' });
    return res.json({ success: true, message: 'Trip removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Modify existing itinerary with natural language instructions
// @route  POST /api/trips/:id/modify
const modifyTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modificationPrompt } = req.body;

    if (!modificationPrompt) {
      return res.status(400).json({ success: false, message: 'Please provide modification instructions.' });
    }

    let existingTrip;
    if (isDbConnected()) {
      existingTrip = await Trip.findById(id);
    } else {
      existingTrip = await memoryStore.findTripById(id);
    }

    if (!existingTrip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    console.log(`[Trip Controller] Modifying trip ${id} with instruction: "${modificationPrompt}"`);
    const modifiedTripResult = await tripOrchestrator.modifyTrip(existingTrip, modificationPrompt);

    let updatedTrip;
    if (isDbConnected()) {
      updatedTrip = await Trip.findByIdAndUpdate(id, {
        ...modifiedTripResult,
        specialInstructions: `${existingTrip.specialInstructions || ''} | Mod: ${modificationPrompt}`
      }, { new: true });
    } else {
      updatedTrip = await memoryStore.updateTrip(id, {
        ...modifiedTripResult,
        specialInstructions: `${existingTrip.specialInstructions || ''} | Mod: ${modificationPrompt}`
      });
    }

    return res.json({
      success: true,
      message: 'Trip modified and re-orchestrated successfully by AI agents',
      trip: updatedTrip
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Replan full trip
// @route  POST /api/trips/:id/replan
const replanTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    let existingTrip;

    if (isDbConnected()) {
      existingTrip = await Trip.findById(id);
    } else {
      existingTrip = await memoryStore.findTripById(id);
    }

    if (!existingTrip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const replannedResult = await tripOrchestrator.orchestrateTrip(existingTrip);

    let updatedTrip;
    if (isDbConnected()) {
      updatedTrip = await Trip.findByIdAndUpdate(id, replannedResult, { new: true });
    } else {
      updatedTrip = await memoryStore.updateTrip(id, replannedResult);
    }

    return res.json({
      success: true,
      message: 'Trip completely re-planned and re-validated by AI Agent network',
      trip: updatedTrip
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get public shared trip view
// @route  GET /api/trips/share/:shareId
const getSharedTrip = async (req, res, next) => {
  try {
    const { shareId } = req.params;

    if (isDbConnected()) {
      let trip = await Trip.findOne({ shareId });
      if (!trip) {
        trip = await Trip.findById(shareId).catch(() => null);
      }
      if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found' });
      return res.json({ success: true, trip, isReadOnly: true });
    }

    // Memory Store
    let trip = null;
    const all = await memoryStore.getAllTrips();
    trip = all.find(t => t.shareId === shareId || t.id === shareId);

    if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found' });
    return res.json({ success: true, trip, isReadOnly: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  modifyTrip,
  replanTrip,
  getSharedTrip,
};
