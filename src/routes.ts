import { Hono } from "hono";
import { login, register, logout } from "./controllers/AuthController";
import { authMiddleware } from "./middleware/authMiddleware";
const routes = new Hono();

// Auth routes
routes.post("/login", login);
routes.post("/register", register);
routes.post("/logout", logout);

// Protected route with authentication
routes.get("/protected", authMiddleware, async (c) => {
  return c.json({ message: "This is a protected route" }, 200);
});

export default routes;
