import mongoose from "mongoose";

/**
 * Cached record of a Codeforces submission for a user.
 * Mirrors the CF Submission return object fully.
 */
const CodeforcesSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ─── CF Submission Fields ─────────────────────────────────────────
    submissionId: { type: Number, required: true, unique: true, index: true },
    contestId: Number,
    creationTimeSeconds: { type: Number, required: true },

    // ─── Problem Details ──────────────────────────────────────────────
    problem: {
      contestId: Number,
      problemsetName: String,
      index: String,         // e.g. "A", "B1"
      name: String,
      type: { type: String, enum: ["PROGRAMMING", "QUESTION"] },
      points: Number,
      rating: Number,        // problem difficulty rating
      tags: [String],
    },

    // ─── Submission Result ────────────────────────────────────────────
    programmingLanguage: String,
    verdict: {
      type: String,
      enum: [
        "FAILED", "OK", "PARTIAL", "COMPILATION_ERROR", "RUNTIME_ERROR",
        "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "MEMORY_LIMIT_EXCEEDED",
        "IDLENESS_LIMIT_EXCEEDED", "SECURITY_VIOLATED", "CRASHED",
        "INPUT_PREPARATION_CRASHED", "CHALLENGED", "SKIPPED",
        "TESTING", "REJECTED", "SUBMITTED"
      ],
    },
    testset: String,
    passedTestCount: Number,
    timeConsumedMillis: Number,
    memoryConsumedBytes: Number,
    points: Number,

    // ─── Relative Contest Time ────────────────────────────────────────
    relativeTimeSeconds: Number,

    // ─── Author / Party ───────────────────────────────────────────────
    author: {
      participantType: {
        type: String,
        enum: ["CONTESTANT", "PRACTICE", "VIRTUAL", "MANAGER", "OUT_OF_COMPETITION"],
      },
      ghost: Boolean,
      room: Number,
      startTimeSeconds: Number,
    },
  },
  {
    timestamps: true,
    // TTL-less — stored permanently as historical record
  }
);

// Compound index for efficient user+time sorted queries
CodeforcesSubmissionSchema.index({ user: 1, creationTimeSeconds: -1 });
// Index for tag-based analysis
CodeforcesSubmissionSchema.index({ user: 1, "problem.tags": 1 });
// Index for verdict-based filtering
CodeforcesSubmissionSchema.index({ user: 1, verdict: 1 });

export default mongoose.model("CodeforcesSubmission", CodeforcesSubmissionSchema);
