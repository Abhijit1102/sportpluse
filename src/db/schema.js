import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * ENUMS
 */
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

/**
 * MATCHES TABLE
 */
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),

  sport: text("sport").notNull(),

  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),

  status: matchStatusEnum("status")
    .notNull()
    .default("scheduled"),

  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),

  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * COMMENTARY TABLE
 * Designed for high-frequency inserts during live matches
 */
export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),

  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),

  minute: integer("minute"),          // e.g. 45, 90
  sequence: integer("sequence"),       // ordering within same minute
  period: text("period"),              // e.g. "1st_half", "2nd_half", "extra_time"

  eventType: text("event_type"),        // goal, foul, card, substitution
  actor: text("actor"),                 // player or referee
  team: text("team"),                   // home / away or team name

  message: text("message").notNull(),   // human-readable commentary

  metadata: jsonb("metadata"),          // flexible event payload
  tags: text("tags"),                   // comma-separated or lightweight labels

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
