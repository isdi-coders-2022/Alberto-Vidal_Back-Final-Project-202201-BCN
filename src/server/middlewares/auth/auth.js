const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : null;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
      return;
    }

    res.status(403).json({ error: "no token provided" });
  } catch (error) {
    error.status = 403;
    error.message = "invalid token";
    next(error);
  }
};

module.exports = auth;
