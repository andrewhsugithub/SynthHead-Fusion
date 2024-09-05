import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import "dotenv/config";
import fs from "fs";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

const app = new Hono();
app.use(cors({ origin: "*" }));
app.use(logger(customLogger));

const createJWTToken = async (
  tokenType: "access-token" | "refresh-token",
  username: string,
  password: string,
  userId: string
) => {
  const fifteenMinInSec = 15 * 60;
  const thirtyDaysInSec = 30 * 24 * 60 * 60;

  const payload = {
    username: username,
    password: password,
    exp:
      Math.floor(Date.now() / 1000) +
      (tokenType === "access-token"
        ? fifteenMinInSec // access token
        : thirtyDaysInSec), // refresh token
    iat: 123, //TODO
    nbf: 123, //TODO
    role: "admin", //TODO: think about the roles (admin, logged-in, guest)
    iss: "auth-service",
    sub: userId,
  };
  const privateKey = fs.readFileSync(
    process.env.JWT_PRIVATE_KEY_PATH!,
    "utf-8"
  ); // format private key
  const alg: JWTAlg = process.env.JWT_ALG as JWTAlg;
  const token = await sign(payload, privateKey, alg);
  console.log(`JWT ${tokenType}: ${token}`);
  return token;
};

const registerSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
});

app.post("/register", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { username, password } = validatedData;
  // sync call to user service
  // TODO: change to kafka for async
  // TODO: add response schema
  const response: any = await fetch("http://localhost:3001/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    return c.text("Error contacting authentication service", 500);
  }

  const responseBody = await response.json();
  console.log("response:", responseBody);

  const accessToken = await createJWTToken(
    "access-token",
    username,
    password,
    responseBody?.userId
  );

  const refreshToken = await createJWTToken(
    "refresh-token",
    username,
    password,
    responseBody?.userId
  );

  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return c.json({
    msg: "User registered successfully!",
    accessToken,
  });
});

app.get("/login", async (c) => {
  const tokenToVerify = c.req.header("Authorization")?.split(" ")[1]!;
  const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, "utf-8"); // format public key

  const alg: JWTAlg = process.env.JWT_ALG as JWTAlg;
  const decodedPayload = await verify(tokenToVerify, publicKey, alg);
  customLogger("user id:", `${decodedPayload["sub"]}`); // get user id
  return c.json(decodedPayload);
});

app.get("/", (c) => {
  return c.text("Hello auth service!");
});

const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
