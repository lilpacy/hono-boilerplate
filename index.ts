import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import routes from "./src/routes";

// Initialize Hono app
const app = new Hono();

// Cors Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Initialize middlewares
app.use("*", logger(), prettyJSON());

// default route
app.get("/", async (c) => {
  return c.json({ message: "Welcome to Hono" }, 200);
});

// Initialize routes
app.route("/", routes);

export default app;
