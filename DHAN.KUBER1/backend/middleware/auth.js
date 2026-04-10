const { verifyToken } = require("../utils/auth");

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyToken(token);
    req.userId = String(payload.id);

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Your session is invalid or expired." });
  }
}

module.exports = requireAuth;
