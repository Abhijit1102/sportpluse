import { z } from "zod";

/**
 * Constants
 */
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

/**
 * Query schema for listing matches
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

/**
 * Params schema for match id
 */
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Helper: ISO date string validation
 */
const isoDateString = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid ISO date string"
  );

/**
 * Schema for creating a match
 */
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),

    startTime: isoDateString,
    endTime: isoDateString,

    homeScore: z.coerce.number().int().min(0).optional(),
    awayScore: z.coerce.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (Date.parse(data.endTime) <= Date.parse(data.startTime)) {
      ctx.addIssue({
        path: ["endTime"],
        message: "endTime must be after startTime",
        code: z.ZodIssueCode.custom,
      });
    }
  });

/**
 * Schema for updating match score
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});
