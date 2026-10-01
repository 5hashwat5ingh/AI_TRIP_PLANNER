const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");


// ============================================================================
// REGISTER
// POST /api/auth/register
// ============================================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ------------------------------------------------------------
    // Validate input
    // ------------------------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    // ------------------------------------------------------------
    // Check existing user
    // ------------------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }


    // ------------------------------------------------------------
    // Hash password
    // ------------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);


    // ------------------------------------------------------------
    // Create user
    // ------------------------------------------------------------

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });


    // ------------------------------------------------------------
    // Generate JWT
    // ------------------------------------------------------------

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });


    // ------------------------------------------------------------
    // Response
    // ------------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("[Auth] Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ============================================================================
// LOGIN
// POST /api/auth/login
// ============================================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    // ------------------------------------------------------------
    // Validate input
    // ------------------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    // ------------------------------------------------------------
    // Find user
    // ------------------------------------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    // ------------------------------------------------------------
    // Compare password
    // ------------------------------------------------------------

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    // ------------------------------------------------------------
    // Generate JWT
    // ------------------------------------------------------------

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });


    // ------------------------------------------------------------
    // Response
    // ------------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("[Auth] Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ============================================================================
// GET CURRENT USER
// GET /api/auth/me
// ============================================================================

const getMe = async (req, res) => {
  try {

    // ------------------------------------------------------------
    // User must be authenticated
    // ------------------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }


    // ------------------------------------------------------------
    // Find user
    // ------------------------------------------------------------

    const user = await User.findById(req.user.id)
      .select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // ------------------------------------------------------------
    // Response
    // ------------------------------------------------------------

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("[Auth] Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ============================================================================
// EXPORT CONTROLLERS
// ============================================================================

module.exports = {
  register,
  login,
  getMe,
};