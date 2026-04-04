import { z } from "zod";

/** Validate req.body against a Zod schema and call next() or return 400 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  req.body = result.data;
  next();
};

// ── Schemas ──────────────────────────────────────────────────────────────────

export const initiateConnectionSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(24, "Handle too long")
    .regex(/^[a-zA-Z0-9_\-.]+$/, "Invalid Codeforces handle format"),
});

export const verifyConnectionSchema = z.object({
  handle: z.string().min(3).max(24),
});

export const disconnectSchema = z.object({}).optional();
