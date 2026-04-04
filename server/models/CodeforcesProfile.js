import mongoose from "mongoose";

/**
 * Stores the complete Codeforces public profile for a connected user.
 * Mirrors the Codeforces `User` return object plus enriched local fields.
 */
const CodeforcesProfileSchema = new mongoose.Schema(
  {
    // Link to our user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ─── Codeforces Identity ─────────────────────────────────────────
    handle: { type: String, required: true, unique: true, trim: true, index: true },
    email: String,          // only if user made it public on CF
    vkId: String,
    openId: String,
    firstName: String,
    lastName: String,
    country: String,
    city: String,
    organization: String,

    // ─── Rating & Rank ───────────────────────────────────────────────
    rating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: "unrated" },    // e.g. "specialist"
    maxRank: { type: String, default: "unrated" },

    // ─── Social Signals ──────────────────────────────────────────────
    contribution: { type: Number, default: 0 },
    friendOfCount: { type: Number, default: 0 },

    // ─── Media ───────────────────────────────────────────────────────
    avatar: { type: String, default: "" },
    titlePhoto: { type: String, default: "" },

    // ─── Time Fields (unix seconds from CF) ──────────────────────────
    lastOnlineTimeSeconds: Number,
    registrationTimeSeconds: Number,

    // ─── Verification State ──────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    verificationCode: String,           // random code user sets as CF surname
    verificationExpiry: Date,

    // ─── Aggregated Stats (computed locally on sync) ─────────────────
    stats: {
      totalSolved: { type: Number, default: 0 },
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      wrongAnswers: { type: Number, default: 0 },
      timeLimitExceeded: { type: Number, default: 0 },
      runtimeErrors: { type: Number, default: 0 },
      compilationErrors: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },   // percentage

      // Problems solved by difficulty rating bucket
      byRating: {
        "800":  { type: Number, default: 0 },
        "900":  { type: Number, default: 0 },
        "1000": { type: Number, default: 0 },
        "1100": { type: Number, default: 0 },
        "1200": { type: Number, default: 0 },
        "1300": { type: Number, default: 0 },
        "1400": { type: Number, default: 0 },
        "1500": { type: Number, default: 0 },
        "1600": { type: Number, default: 0 },
        "1700": { type: Number, default: 0 },
        "1800": { type: Number, default: 0 },
        "1900": { type: Number, default: 0 },
        "2000": { type: Number, default: 0 },
        "2100": { type: Number, default: 0 },
        "2200": { type: Number, default: 0 },
        "2300": { type: Number, default: 0 },
        "2400": { type: Number, default: 0 },
        "2500plus": { type: Number, default: 0 },
        "unrated": { type: Number, default: 0 },
      },

      // Solved by tag (dp, greedy, graphs, etc.)
      byTag: { type: Map, of: Number, default: {} },

      // Solved by verdict
      byVerdict: { type: Map, of: Number, default: {} },

      // Solved by language
      byLanguage: { type: Map, of: Number, default: {} },

      // Contest participation
      contestsParticipated: { type: Number, default: 0 },
      bestRank: { type: Number, default: null },
      worstRank: { type: Number, default: null },

      // Activity heatmap: { 'YYYY-MM-DD': submissionCount }
      dailyActivity: { type: Map, of: Number, default: {} },

      // Current and longest streaks (days with at least 1 submission)
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
    },

    // ─── Last Sync Metadata ──────────────────────────────────────────
    lastSyncedAt: { type: Date, default: null },
    syncStatus: {
      type: String,
      enum: ["idle", "syncing", "success", "failed"],
      default: "idle",
    },
    syncError: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CodeforcesProfile", CodeforcesProfileSchema);
