const { v4: uuidv4 } = require('uuid');

// In-Memory fallback store with preloaded demo data
const users = new Map();
const trips = new Map();

// Sample initial demo user: demo@travelops.ai / password123
const memoryStore = {
  // Users
  createUser: async (userData) => {
    const id = uuidv4();
    const user = {
      _id: id,
      id,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.set(id, user);
    return user;
  },

  findUserByEmail: async (email) => {
    for (const user of users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  },

  findUserById: async (id) => {
    return users.get(id) || null;
  },

  // Trips
  createTrip: async (tripData) => {
    const id = uuidv4();
    const trip = {
      _id: id,
      id,
      ...tripData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    trips.set(id, trip);
    return trip;
  },

  findTripsByUserId: async (userId) => {
    const result = [];
    for (const trip of trips.values()) {
      if (trip.userId === userId) {
        result.push(trip);
      }
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findTripById: async (id) => {
    return trips.get(id) || null;
  },

  updateTrip: async (id, updateData) => {
    const existing = trips.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    trips.set(id, updated);
    return updated;
  },

  deleteTrip: async (id) => {
    return trips.delete(id);
  },

  getAllTrips: async () => {
    return Array.from(trips.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

module.exports = memoryStore;
