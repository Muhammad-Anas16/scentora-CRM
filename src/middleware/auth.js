import jwt from "jsonwebtoken";
import helperFunction from "@/lib/helperFunction";
import User from "@/models/User";

/**
 * Authenticate user from JWT token
 * @param {Request} req - Next.js request object
 * @returns {Promise<{userId: string, email: string}>} - Decoded token data
 * @throws {Error} - If authentication fails
 */
export async function authenticate(req) {
  try {
    // Get token from Authorization header first (most reliable)
    let token = req.headers.get("authorization");
    
    if (token) {
      token = token.replace("Bearer ", "").trim();
    }
    
    // If no token in header, try to get from cookies
    if (!token) {
      const cookies = req.headers.get("cookie");
      if (cookies) {
        // Try multiple patterns to match cookie - handle URL encoding
        const patterns = [
          /token=([^;,\s]+)/,
          /token="([^"]+)"/,
          /token=([^;]+)/,
        ];
        
        for (const pattern of patterns) {
          const tokenMatch = cookies.match(pattern);
          if (tokenMatch && tokenMatch[1]) {
            token = decodeURIComponent(tokenMatch[1].trim());
            break;
          }
        }
      }
    }

    if (!token) {
      throw new Error("No token provided");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      user: user.toObject()
    };
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new Error("Invalid or expired token");
    }
    throw error;
  }
}

/**
 * Middleware wrapper for protected routes
 * @param {Function} handler - Route handler function
 * @returns {Function} - Wrapped handler with authentication
 */
export function withAuth(handler) {
  return async (req) => {
    try {
      const authData = await authenticate(req);
      // Attach auth data to request
      req.auth = authData;
      return handler(req);
    } catch (error) {
      return helperFunction(401, null, true, error.message || "Unauthorized");
    }
  };
}

/**
 * Check if user has required role
 * @param {Request} req - Request object with auth data
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export function hasRole(req, allowedRoles) {
  if (!req.auth || !req.auth.user) {
    return false;
  }
  return allowedRoles.includes(req.auth.user.role);
}

/**
 * Middleware for role-based access control
 * @param {Function} handler - Route handler
 * @param {string[]} allowedRoles - Allowed roles
 * @returns {Function}
 */
export function withRole(handler, allowedRoles) {
  return withAuth(async (req) => {
    if (!hasRole(req, allowedRoles)) {
      return helperFunction(403, null, true, "Insufficient permissions");
    }
    return handler(req);
  });
}

