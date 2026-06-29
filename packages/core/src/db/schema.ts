import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] })
    .default("beginner")
    .notNull(),
  skillTracking: integer("skill_tracking", { mode: "boolean" })
    .default(true)
    .notNull(),
  gradualReveal: integer("gradual_reveal", { mode: "boolean" })
    .default(true)
    .notNull(),
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Skip topics table
export const skipTopics = sqliteTable("skip_topics", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  topic: text("topic").notNull(),
  category: text("category"),
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  decisionsCount: integer("decisions_count").default(0).notNull(),
  learningPointsCount: integer("learning_points_count").default(0).notNull(),
});

// Decisions table
export const decisions = sqliteTable("decisions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  hint: text("hint"),
  options: text("options"), // JSON string
  explanation: text("explanation"),
  correctAnswer: text("correct_answer"),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] })
    .default("medium")
    .notNull(),
  locked: integer("locked", { mode: "boolean" }).default(false).notNull(),
  userChoice: text("user_choice"),
  aiSuggestion: text("ai_suggestion"),
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Skills table
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  mastered: integer("mastered", { mode: "boolean" })
    .default(false)
    .notNull(),
  lastPracticed: text("last_practiced")
    .default(new Date().toISOString())
    .notNull(),
});

// Learning points table
export const learningPoints = sqliteTable("learning_points", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id),
  point: text("point").notNull(),
  topic: text("topic"),
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Project templates table
export const projectTemplates = sqliteTable("project_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] })
    .default("medium")
    .notNull(),
  techStack: text("tech_stack"), // JSON string
  challenges: text("challenges"), // JSON string
  learningObjectives: text("learning_objectives"), // JSON string
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Chat messages table
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  decisions: text("decisions"), // JSON string
  hints: text("hints"), // JSON string
  createdAt: text("created_at")
    .default(new Date().toISOString())
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  skipTopics: many(skipTopics),
  sessions: many(sessions),
  skills: many(skills),
}));

export const skipTopicsRelations = relations(skipTopics, ({ one }) => ({
  user: one(users, {
    fields: [skipTopics.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  decisions: many(decisions),
  learningPoints: many(learningPoints),
  chatMessages: many(chatMessages),
}));

export const decisionsRelations = relations(decisions, ({ one }) => ({
  session: one(sessions, {
    fields: [decisions.sessionId],
    references: [sessions.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const learningPointsRelations = relations(learningPoints, ({ one }) => ({
  session: one(sessions, {
    fields: [learningPoints.sessionId],
    references: [sessions.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(sessions, {
    fields: [chatMessages.sessionId],
    references: [sessions.id],
  }),
}));
