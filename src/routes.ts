import { Hono } from "hono";
import { login, register } from "./controllers/AuthController";
import { authMiddleware } from "./middleware/authMiddleware";

const routes = new Hono();

// Auth routes
routes.post("/login", login);
routes.post("/register", register);

// Protected route with authentication
routes.get("/protected", authMiddleware, async (context) => {
  return context.json({ message: "This is a protected route" }, 200);
});

export default routes;
