import CodeforcesProfile from "../../models/CodeforcesProfile.js";
import CodeforcesSubmission from "../../models/CodeforcesSubmission.js";
import CodeforcesRatingHistory from "../../models/CodeforcesRatingHistory.js";
import User from "../../models/User.js";

class CodeforcesRepository {
  // ── Profile ─────────────────────────────────────────────────────────────

  static async findProfileByUserId(userId) {
    return CodeforcesProfile.findOne({ user: userId });
  }

  static async findProfileByHandle(handle) {
    return CodeforcesProfile.findOne({ handle: handle.toLowerCase() });
  }

  static async upsertProfile(userId, data) {
    return CodeforcesProfile.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  static async deleteProfileByUserId(userId) {
    return CodeforcesProfile.findOneAndDelete({ user: userId });
  }

  static async updateSyncStatus(userId, status, error = null) {
    return CodeforcesProfile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          syncStatus: status,
          syncError: error,
          ...(status === "success" ? { lastSyncedAt: new Date() } : {}),
        },
      }
    );
  }

  // ── Submissions ──────────────────────────────────────────────────────────

  static async bulkUpsertSubmissions(submissions) {
    if (!submissions.length) return;
    const ops = submissions.map((s) => ({
      updateOne: {
        filter: { submissionId: s.submissionId },
        update: { $setOnInsert: s },
        upsert: true,
      },
    }));
    return CodeforcesSubmission.bulkWrite(ops, { ordered: false });
  }

  static async getSubmissions(userId, options = {}) {
    const {
      limit = 50,
      skip = 0,
      verdict,
      tag,
      sort = { creationTimeSeconds: -1 },
    } = options;

    const filter = { user: userId };
    if (verdict) filter.verdict = verdict;
    if (tag) filter["problem.tags"] = tag;

    return CodeforcesSubmission.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  static async countSubmissions(userId, filter = {}) {
    return CodeforcesSubmission.countDocuments({ user: userId, ...filter });
  }

  static async getRecentSubmissions(userId, count = 20) {
    return CodeforcesSubmission.find({ user: userId })
      .sort({ creationTimeSeconds: -1 })
      .limit(count)
      .lean();
  }

  static async deleteSubmissionsByUserId(userId) {
    return CodeforcesSubmission.deleteMany({ user: userId });
  }

  // ── Rating History ────────────────────────────────────────────────────────

  static async bulkUpsertRatingHistory(records) {
    if (!records.length) return;
    const ops = records.map((r) => ({
      updateOne: {
        filter: { user: r.user, contestId: r.contestId },
        update: { $setOnInsert: r },
        upsert: true,
      },
    }));
    return CodeforcesRatingHistory.bulkWrite(ops, { ordered: false });
  }

  static async getRatingHistory(userId) {
    return CodeforcesRatingHistory.find({ user: userId })
      .sort({ ratingUpdateTimeSeconds: 1 })
      .lean();
  }

  static async deleteRatingHistoryByUserId(userId) {
    return CodeforcesRatingHistory.deleteMany({ user: userId });
  }

  // ── User handles ──────────────────────────────────────────────────────────

  static async setUserCodeforcesHandle(userId, handle) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { "handles.codeforces": handle } },
      { new: true }
    );
  }

  static async clearUserCodeforcesHandle(userId) {
    return User.findByIdAndUpdate(
      userId,
      { $unset: { "handles.codeforces": "" } },
      { new: true }
    );
  }
}

export default CodeforcesRepository;
