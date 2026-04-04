import mongoose from "mongoose";

/**
 * Stores the full rating history for a Codeforces user.
 * Each document is one RatingChange entry from `user.rating` API.
 */
const CodeforcesRatingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    handle: { type: String, required: true, index: true },

    // ─── CF RatingChange Fields ───────────────────────────────────────
    contestId: { type: Number, required: true },
    contestName: String,
    rank: Number,                              // Rank in that contest
    ratingUpdateTimeSeconds: Number,           // Unix timestamp
    oldRating: Number,
    newRating: Number,
    ratingChange: Number,                      // computed: newRating - oldRating
  },
  { timestamps: true }
);

// One entry per contest per user
CodeforcesRatingHistorySchema.index({ user: 1, contestId: 1 }, { unique: true });
CodeforcesRatingHistorySchema.index({ user: 1, ratingUpdateTimeSeconds: 1 });

export default mongoose.model("CodeforcesRatingHistory", CodeforcesRatingHistorySchema);
