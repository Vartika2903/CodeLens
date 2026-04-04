import api from "./api.js";

/** All Codeforces API calls go through the shared axios instance (auth token auto-injected) */
// NOTE: baseURL is already `http://localhost:8000/api` — do NOT prefix paths with /api again

/**
 * Step 1 — Supply CF handle to initiate surname verification flow
 * @param {string} handle
 */
export const cfInitiateConnection = (handle) =>
  api.post("/codeforces/connect", { handle });

/**
 * Step 2 — Confirm surname was updated; verify & link account
 * @param {string} handle
 */
export const cfVerifyConnection = (handle) =>
  api.post("/codeforces/verify", { handle });

/** Get full stored CF profile (includes stats, heatmap data) */
export const cfGetProfile = () => api.get("/codeforces/profile");

/** Get rating history array for chart */
export const cfGetRatingHistory = () => api.get("/codeforces/rating-history");

/** Get recent submissions list */
export const cfGetSubmissions = (count = 20) =>
  api.get("/codeforces/submissions", { params: { count } });

/** Get lightweight dashboard summary */
export const cfGetDashboardSummary = () => api.get("/codeforces/dashboard");

/** Trigger a manual data refresh */
export const cfRefreshData = () => api.post("/codeforces/refresh");

/** Disconnect CF account */
export const cfDisconnect = () => api.delete("/codeforces/disconnect");
