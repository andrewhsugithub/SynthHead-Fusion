import { eq } from "drizzle-orm";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "../lib/db/db";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { users } from "../lib/db/schema/user.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

const registerSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
});

app.post("/register", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { username, password } = validatedData;

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db
      .insert(users)
      .values({ username, password: hashedPassword })
      .returning({ userId: users.id });
    const userId = user[0].userId;

    // create a bucket for the user
    // TODO: change to kafka for async and decoupling from registration so that the user can be registered even if the bucket creation fails
    // TODO: add response schema
    // TODO: add retry logic
    console.log("Creating bucket for user", process.env.BUCKET_BASE_URL);
    const response: any = await fetch(
      `${process.env.BUCKET_BASE_URL!}/create-bucket`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketName: userId }),
      }
    );

    if (!response.ok) {
      return c.text("Error contacting bucket service", 500);
    }

    return c.json({
      userId,
      message: "User registered successfully!",
    });
  } catch (error) {
    return c.text("Error registering user", 500);
  }
});

app.get("/login", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { username, password } = validatedData;

  try {
    const user = await db.query.users.findFirst({
      with: {
        username: {
          where: eq(users.username, username),
        },
      },
    });
    if (!user) {
      return c.text("User not found", 404);
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return c.text("Invalid credentials", 401);
    }

    // Proceed with login (e.g., generate tokens, etc.)
    return c.json({ message: "Login successful" });
  } catch (error) {
    return c.text("Error logging in", 500);
  }
});

app.get("/", (c) => {
  return c.text("Hello user service!");
});

const port = 3003;
console.log(`User service is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
