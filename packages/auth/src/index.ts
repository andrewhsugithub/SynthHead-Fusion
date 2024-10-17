import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { setCookie, getCookie } from "hono/cookie";
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

interface UserPayload extends Awaited<ReturnType<typeof verify>> {
  username?: string;
  password?: string;
  role?: string;
  iss?: string;
  sub?: string;
}

const createJWTToken = async (
  tokenType: "access-token" | "refresh-token",
  username: string,
  password: string,
  userId: string
) => {
  const fifteenMinInSec = 15 * 60;
  const thirtyDaysInSec = 30 * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  const payload: UserPayload = {
    username: username,
    password: password,
    exp:
      now +
      (tokenType === "access-token"
        ? fifteenMinInSec // access token
        : thirtyDaysInSec), // refresh token
    iat: now, // issued at
    nbf: now, // not before (token is invalid before this time)
    role: "admin", //TODO: think about the roles (admin, logged-in, guest)
    iss: "auth-service",
    sub: userId,
  };
  console.log("tokenType:", tokenType);
  console.log("payload:", payload);
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
  console.log("user service base url:", process.env.USER_SERVICE_BASE_URL);
  const response: any = await fetch(
    `${process.env.USER_SERVICE_BASE_URL!}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  const responseBody = await response.json();
  console.log("response:", responseBody);

  if (!response.ok) {
    return c.json(
      { message: "Error contacting user service" },
      response.status
    );
  }

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
    message: "User registered successfully!",
    accessToken,
  });
});

app.get("/refresh", async (c) => {
  const refreshToken = getCookie(c, "refreshToken");
  const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, "utf-8"); // format public key

  const alg: JWTAlg = process.env.JWT_ALG as JWTAlg;
  const decodedPayload = (await verify(
    refreshToken!,
    publicKey,
    alg
  )) as UserPayload;
  customLogger("user id:", `${decodedPayload["sub"]}`); // get user id

  const accessToken = await createJWTToken(
    "access-token",
    decodedPayload["username"]!,
    decodedPayload["password"]!,
    decodedPayload["sub"]!
  );

  return c.json({ accessToken });
});

app.post("/login", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { username, password } = validatedData;
  // sync call to user service
  // TODO: change to kafka for async
  // TODO: add response schema
  console.log("user service base url:", process.env.USER_SERVICE_BASE_URL);
  const response: any = await fetch(
    `${process.env.USER_SERVICE_BASE_URL!}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  const responseBody = await response.json();
  console.log("response:", responseBody);

  if (!response.ok) {
    return c.text(responseBody.message, response.status);
  }

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
    message: "User logged in successfully!",
    accessToken,
  });
});

app.get("/", (c) => {
  return c.text("Hello auth service!");
});

const port = 3001;
console.log(`Auth service is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
