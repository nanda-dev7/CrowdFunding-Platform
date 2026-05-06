// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or missing token"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();

//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Token expired"
//       });
//     }

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token"
//       });
//     }

//     console.error("Auth middleware error:", error);
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized"
//     });
//   }
// };

// export default authMiddleware;



import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

/**
 * protect — verifies the JWT access token and attaches req.user.
 * Owned by Member 1 (src/middleware/auth.middleware.js).
 * This stub keeps Member 2's routes self-contained during development;
 * replace with Member 1's implementation in the merged project.
 */
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash -refreshToken");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * requireRole — allows access only to listed roles.
 * Owned by Member 1 (src/middleware/role.middleware.js).
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export { protect, requireRole };