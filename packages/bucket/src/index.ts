import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import fs from "fs";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.use(logger());

//TODO: add middleware to see 1. if user has access to the bucket 2. if the file exists 3. if the file is public (output/videos only)
app.use(
  `/${process.env.BUCKET_DIR_NAME}/*`,
  serveStatic({ root: process.env.BUCKET_RELATIVE_PATH })
);

const registerSchema = z.object({
  bucketName: z.string().min(1).max(255),
});

app.post("/create-bucket", zValidator("json", registerSchema), async (c) => {
  const validatedData = c.req.valid("json");
  const { bucketName } = validatedData;
  const dir = `${process.env.BUCKET_RELATIVE_PATH}/${process.env.BUCKET_DIR_NAME}/${bucketName}`;

  if (fs.existsSync(dir)) return c.text("Bucket already exists!");

  fs.mkdirSync(dir); // create bucket folder

  const objects = ["audio", "video", "MuseTalk", "Real3D"]; // bucket objects
  objects.forEach((object) => {
    fs.mkdirSync(`${dir}/${object}`); // create object folder
  });

  return c.text("Bucket created successfully!");
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3002;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
