import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";

const app = new Hono();

app.use(logger());

app.use(
  `/${process.env.BUCKET_DIR_NAME}/*`,
  serveStatic({ root: process.env.BUCKET_RELATIVE_PATH })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
