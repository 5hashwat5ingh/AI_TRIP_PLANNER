const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  travelers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    total: { type: Number, default: 1 },
  },
  budget: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  preferences: [{
    type: String,
  }],
  travelStyle: {
    type: String,
    enum: ['budget', 'balanced', 'comfort', 'luxury'],
    default: 'balanced',
  },
  specialInstructions: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['planning', 'completed', 'failed', 'saved'],
    default: 'completed',
  },
  
  // Multi-Agent outputs
  flights: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  hotels: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  activities: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  transportation: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  weather: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  budgetAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  itinerary: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  validation: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  aiReasoning: {
    type: [String],
    default: [],
  },
  agentLogs: [{
    agentName: String,
    status: String,
    durationMs: Number,
    iteration: Number,
    timestamp: Date,
    message: String,
  }],
  replanningHistory: [{
    iteration: Number,
    reason: String,
    adjustments: mongoose.Schema.Types.Mixed,
    timestamp: Date,
  }],
  isSaved: {
    type: Boolean,
    default: false,
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Trip', tripSchema);
