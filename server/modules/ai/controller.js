import AiService from "./service.js";
import ApiError from "../../utils/ApiError.js";

class AiController {
  /**
   * GET /api/ai/insight/stream
   * Streams a personalized AI growth insight using SSE.
   */
  static async streamInsight(req, res, next) {
    try {
      await AiService.streamInsight(req.user._id, res);
    } catch (err) {
      // If headers already sent (SSE started), we can't send JSON error
      if (res.headersSent) {
        console.error("[AI Controller] Error after headers sent:", err.message);
        return;
      }
      next(err instanceof ApiError ? err : new ApiError(500, err.message));
    }
  }
}

export default AiController;
