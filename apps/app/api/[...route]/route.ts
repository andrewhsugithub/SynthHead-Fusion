import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { handle } from "@hono/node-server/vercel";
import type { JwtVariables } from "hono/jwt";
import type { JWTAlg } from "@packages/types/jwt";
import { readFile } from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Specify the variable types to infer the `c.get('jwtPayload')`:
type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(
  "/*",
  jwt({
    secret: await readFile(process.env.JWT_PUBLIC_KEY_PATH!, "utf-8"),
    alg: process.env.JWT_ALG as JWTAlg,
  })
);

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
