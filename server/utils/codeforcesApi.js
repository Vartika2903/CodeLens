import axios from "axios";

const CF_BASE_URL = "https://codeforces.com/api";

/**
 * Generic Codeforces API caller with error normalization.
 * @param {string} method  - e.g. "user.info"
 * @param {object} params  - Query params
 */
const cfRequest = async (method, params = {}) => {
  const url = `${CF_BASE_URL}/${method}`;
  const response = await axios.get(url, {
    params,
    timeout: 10_000,
    headers: { "Accept-Encoding": "gzip, deflate" },
  });

  const data = response.data;

  if (data.status !== "OK") {
    const err = new Error(data.comment || "Codeforces API error");
    err.cfError = true;
    err.statusCode = 400;
    throw err;
  }

  return data.result;
};

// ── Public API methods ──────────────────────────────────────────────────────

/**
 * Fetch user profile info.
 * @param {string} handle
 */
export const cfGetUserInfo = (handle) =>
  cfRequest("user.info", { handles: handle });

/**
 * Fetch all rating history for a user.
 * @param {string} handle
 */
export const cfGetUserRating = (handle) =>
  cfRequest("user.rating", { handle });

/**
 * Fetch submissions for a user (paginated).
 * @param {string} handle
 * @param {number} from   1-based start index
 * @param {number} count  max items (CF allows up to 10000 with large requests)
 */
export const cfGetUserStatus = (handle, from = 1, count = 10000) =>
  cfRequest("user.status", { handle, from, count });

/**
 * Fetch user's blog entries.
 * @param {string} handle
 */
export const cfGetUserBlogEntries = (handle) =>
  cfRequest("user.blogEntries", { handle });

/**
 * Fetch all problems in the problemset (optionally filter by tags).
 * @param {string[]} tags
 */
export const cfGetProblemset = (tags = []) =>
  cfRequest("problemset.problems", tags.length ? { tags: tags.join(";") } : {});

/**
 * Fetch recent contest list.
 * @param {boolean} gym
 */
export const cfGetContestList = (gym = false) =>
  cfRequest("contest.list", { gym });

/**
 * Fetch rating changes for a specific contest.
 * @param {number} contestId
 */
export const cfGetContestRatingChanges = (contestId) =>
  cfRequest("contest.ratingChanges", { contestId });
