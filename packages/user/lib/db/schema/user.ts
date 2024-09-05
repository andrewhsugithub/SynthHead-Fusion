import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  username: text("username"),
  password: text("password"),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 6,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 6 }).$onUpdate(
    () => new Date()
  ),
});

export type NewUserType = typeof users.$inferInsert;
export type UserType = typeof users.$inferSelect;
