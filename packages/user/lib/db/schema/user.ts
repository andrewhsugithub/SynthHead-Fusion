import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 6,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 6 }).$onUpdate(
    () => new Date()
  ),
});

export type UserType = typeof users.$inferInsert;
