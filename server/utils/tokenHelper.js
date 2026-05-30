import jwt from "jsonwebtoken";
import "dotenv/config";

// ── Token Generation ─────────────────────────────────────────────────────────

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d"
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
};

// ── Cookie Helpers ────────────────────────────────────────────────────────────

const isProd = process.env.NODE_ENV === "production";

/**
 * Sets both access + refresh tokens as HttpOnly cookies on the response.
 *
 * Why HttpOnly?
 *  - XSS cannot read them (unlike localStorage)
 *  - Automatically sent with every request including browser navigations
 *  - This is what GitHub, Google, Stripe all do
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token — short lived (15 min)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,                 // HTTPS-only in prod
    sameSite: isProd ? "Lax" : "Lax",
    maxAge: 15 * 60 * 1000,        // 15 minutes in ms
    path: "/",
  });

  // Refresh token — long lived (30 days)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "Lax" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    path: "/",
  });
};

/**
 * Clears both auth cookies (used on logout).
 */
export const clearAuthCookies = (res) => {
  const opts = { httpOnly: true, secure: isProd, sameSite: "Lax", path: "/" };
  res.clearCookie("accessToken", opts);
  res.clearCookie("refreshToken", opts);
};
