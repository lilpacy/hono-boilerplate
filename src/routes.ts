import { Hono } from "hono";
import { login, register, logout } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { getCountries, getCountry } from "./controllers/CountryController";
const routes = new Hono().basePath("/api/v1");
// Auth routes
routes.post("/login", login);
routes.post("/register", register);
routes.post("/logout", logout);

// Protected route with authentication
routes.get("/countries", authMiddleware, getCountries);
routes.get("/countries/:id", authMiddleware, getCountry);

routes.get("/protected", authMiddleware, async (c) => {
  return c.json({ message: "This is a protected route" }, 200);
});

export default routes;
