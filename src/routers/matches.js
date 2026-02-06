import { Router } from "express";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { matches } from "../db/schema.js";

export const matchRouter = Router();

const MAX_LIMIT = 100;
matchRouter.get("/", async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid payload",
            details: parsed.error.errors
        });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try {
        const data = await db
            .select()
            .from(matches)
            .orderBy(matches.createdAt, 'desc')
            .limit(limit);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to list matches.",
            details: error.message
        });
    }
});



matchRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid payload",
            details: parsed.error.errors
        });
    }

    const { startTime, endTime, homeScore = 0, awayScore = 0, ...rest } = parsed.data;

    try {
        const [event] = await db.insert(matches).values({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore,
            awayScore,
            status: getMatchStatus(startTime, endTime)
        }).returning();

        res.status(201).json({ data: event });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            error: "Failed to create a match.",
            details: error.message
        });
    }
});
