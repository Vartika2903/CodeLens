import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import AiController from "./controller.js";

const router = Router();

// All AI routes require authentication
router.use(authMiddleware);

/**
 * GET /api/ai/insight/stream
 * Returns a Server-Sent Events stream of personalized AI growth insight.
 */
router.get("/insight/stream", AiController.streamInsight);

export default router;
