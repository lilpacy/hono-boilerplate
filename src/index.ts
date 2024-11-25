import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import routes from "./routes";

// Initialize Hono app
const app = new Hono().basePath("/api/v1");

// Cors Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Initialize middlewares
app.use("*", logger(), prettyJSON());

// Welcome Route
app.get("/", (c) => c.text("Hono Boilerplate"));

// User Routes
app.route("/", routes);

export default app;