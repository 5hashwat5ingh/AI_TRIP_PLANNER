const { verifyToken } = require("../utils/jwt");


// ============================================================================
// REQUIRED AUTHENTICATION
// ============================================================================

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log(
      "[Auth] Authorization Header:",
      authHeader ? "RECEIVED" : "NOT RECEIVED"
    );

    // ------------------------------------------------------------------------
    // Authorization header missing
    // ------------------------------------------------------------------------

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }


    // ------------------------------------------------------------------------
    // Check Bearer format
    // ------------------------------------------------------------------------

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use Bearer <token>",
      });
    }


    // ------------------------------------------------------------------------
    // Extract token
    // ------------------------------------------------------------------------

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }


    // ------------------------------------------------------------------------
    // Verify JWT
    // ------------------------------------------------------------------------

    const decoded = verifyToken(token);

    console.log(
      "[Auth] JWT verified for:",
      decoded.email
    );


    // ------------------------------------------------------------------------
    // Attach authenticated user
    // ------------------------------------------------------------------------

    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "[Auth] JWT Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ============================================================================
// OPTIONAL AUTHENTICATION
// ============================================================================

const optionalAuth = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;


    // ------------------------------------------------------------------------
    // No Authorization header = guest
    // ------------------------------------------------------------------------

    if (!authHeader) {
      req.user = null;
      return next();
    }


    // ------------------------------------------------------------------------
    // Invalid format = guest
    // ------------------------------------------------------------------------

    if (!authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }


    // ------------------------------------------------------------------------
    // Extract token
    // ------------------------------------------------------------------------

    const token = authHeader.substring(7).trim();


    if (!token) {
      req.user = null;
      return next();
    }


    // ------------------------------------------------------------------------
    // Verify token
    // ------------------------------------------------------------------------

    try {

      const decoded = verifyToken(token);

      req.user = decoded;

      console.log(
        "[Optional Auth] User:",
        decoded.email
      );

    } catch (error) {

      // Invalid JWT → treat request as guest
      req.user = null;

      console.log(
        "[Optional Auth] Invalid token → guest"
      );
    }


    next();

  } catch (error) {

    req.user = null;

    next();
  }
};


// ============================================================================
// EXPORT
// ============================================================================

module.exports = {
  authMiddleware,
  optionalAuth,
};