import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { RegisterUserSchema } from "@packages/schema/registerSchema";
import { registerUserResponse } from "@packages/types/jwt";
import {} from "hono/cookie";
export const runtime = "edge";

const app = new Hono().basePath("/api/register");

app.post("/", zValidator("json", RegisterUserSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { username, password } = validatedData;
  // TODO: add try catch
  const response = await fetch(
    `${process.env.AUTH_SERVICE_BASE_URL!}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );
  const data: registerUserResponse = await response.json();
  return c.json(data);
});

export const GET = handle(app);
export const POST = handle(app);
