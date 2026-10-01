const jwt = require("jsonwebtoken");


// ============================================================================
// CONFIGURATION
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "7d";


if (!JWT_SECRET) {
  console.warn(
    "⚠️ JWT_SECRET is not configured"
  );
}


// ============================================================================
// GENERATE TOKEN
// ============================================================================

const generateToken = (payload) => {

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured"
    );
  }

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};


// ============================================================================
// VERIFY TOKEN
// ============================================================================

const verifyToken = (token) => {

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured"
    );
  }

  return jwt.verify(
    token,
    JWT_SECRET
  );
};


// ============================================================================
// EXPORT
// ============================================================================

module.exports = {
  generateToken,
  verifyToken,
};