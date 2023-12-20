import jwt from "jsonwebtoken";
import jwtConfig from "./jwtConfig.js";

export const jwtTokenAuthentication = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(404).send("404 Not found - No token provided.");

  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

export function requireRole(role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(404).send("404 Not Found - Access denied.");
    }
  };
}
