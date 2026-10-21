const jwt = require("jsonwebtoken");

/*
=========================================================
PROTECT
=========================================================

Verifies that the request contains a valid JWT.

The authenticated user's information is attached to:

req.user
*/

const protect = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
};

/*
=========================================================
ADMIN ONLY
=========================================================

This middleware must be used AFTER protect.

Example:

router.get(
  "/orders",
  protect,
  adminOnly,
  getAllOrders
);

The role comes from the server-issued JWT.
The customer cannot simply send:

{
  "role": "admin"
}

from the frontend and bypass this check.
*/

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};

