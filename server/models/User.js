const mongoose = require("mongoose");


// ============================================================================
// USER SCHEMA
// ============================================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================================
// MODEL
// ============================================================================

const User = mongoose.model(
  "User",
  userSchema
);


module.exports = User;