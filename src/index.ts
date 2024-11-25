import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import routes from "./routes";
// import { errorHandler, notFound } from './middlewares'
// import {supabaseAnon, supabaseService} from './src/supabaseClient'

type Bindings = {
  MY_KV: KVNamespace;
  PORT: string;
};

const port = 3000;
// Initialize Hono app
const app = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

// Initialize middlewares
app.use("*", logger(), prettyJSON());

// Cors Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Welcome Route
app.get("/", (c) => c.text("Hono Boilerplate"));

// User Routes
app.route("/", routes);

export default {
  port,
  fetch: app.fetch,
};
