import { jwt } from "hono/jwt";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import type { JWTAlg } from "@packages/types/jwt";
import { handle } from "hono/vercel";

export const runtime = "edge";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>().basePath("/api/synthhead");

app.use(
  "/*",
  jwt({
    secret: process.env.JWT_PUBLIC_KEY!,
    alg: process.env.JWT_ALG as JWTAlg,
  })
);

app.get("/hello", async (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
