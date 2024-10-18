import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { writeFile, mkdir, readFile } from "fs/promises";
import fs from "fs";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

// Specify the variable types to infer the `c.get('jwtPayload')`:
type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.use(
  "/auth/*",
  jwt({
    secret: await readFile(process.env.JWT_PUBLIC_KEY_PATH!, "utf-8"),
    alg: process.env.JWT_ALG as JWTAlg,
  })
);

app.use(logger());

//TODO: add middleware to see 1. if user has access to the bucket 2. if the file exists 3. if the file is public (output/videos only)
app.use(
  `/${process.env.BUCKET_DIR_NAME}/*`,
  serveStatic({ root: process.env.BUCKET_RELATIVE_PATH })
);

const ACCEPTED_VIDEO_FILE_TYPES = ["video/mp4", "video/webm"];
const ACCEPTED_AUDIO_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3"];
const ACCEPTED_IMAGE_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

app.post("/auth/upload", async (c) => {
  const decodedPayload = c.get("jwtPayload");
  const userId = decodedPayload["sub"];

  const body = await c.req.parseBody();
  const file: File = body["uploadedFile"] as File;
  //TODO: check file type
  const emotion = body["emotion"] || "neutral";

  let savePath = "";
  if (ACCEPTED_AUDIO_FILE_TYPES.includes(file.type)) {
    savePath = `${process.env.BUCKET_RELATIVE_PATH}${process.env.BUCKET_DIR_NAME}/${userId}/audio/`;
  } else if (ACCEPTED_VIDEO_FILE_TYPES.includes(file.type)) {
    savePath = `${process.env.BUCKET_RELATIVE_PATH}${process.env.BUCKET_DIR_NAME}/${userId}/video/`;
  } else if (ACCEPTED_IMAGE_FILE_TYPES.includes(file.type)) {
    savePath = `${process.env.BUCKET_RELATIVE_PATH}${process.env.BUCKET_DIR_NAME}/${userId}/image/${emotion}/`;
    if (!fs.existsSync(savePath)) {
      await mkdir(savePath);
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await writeFile(`${savePath}${file.name}`, buffer);

  return c.text("File uploaded successfully!");
});

const registerSchema = z.object({
  bucketName: z.string().min(1).max(255),
});

app.post("/create-bucket", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { bucketName } = validatedData;
  const dir = `${process.env.BUCKET_RELATIVE_PATH}/${process.env.BUCKET_DIR_NAME}/${bucketName}`;

  if (fs.existsSync(dir)) return c.text("Bucket already exists!");

  await mkdir(dir); // create bucket folder

  const objects = ["audio", "video", "MuseTalk", "Real3D", "image"]; // bucket objects
  await Promise.all(
    objects.map(
      (object) => mkdir(`${dir}/${object}`) // create object folder
    )
  );

  return c.text("Bucket created successfully!");
});

app.get("/", (c) => {
  return c.text("Hello Bucket Service!");
});

const port = 3002;
console.log(`Bucket service is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
