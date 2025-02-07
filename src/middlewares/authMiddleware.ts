import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";
import { createPrismaClient } from "../db/prismaClient";
import { setAuthCookies } from "../helpers";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: number;
      email: string;
    };
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = getCookie(c, "accessToken");
  const refreshToken = getCookie(c, "refreshToken");
  let prisma = null;

  try {
    if (!accessToken && refreshToken) {
      // Handle refresh token flow
      const payload = (await verify(refreshToken, c.env.JWT_SECRET)) as {
        userId: number;
        type: string;
      };

      if (payload.type !== "refresh") {
        return c.json({ error: "Invalid refresh token" }, 401);
      }

      prisma = await createPrismaClient(c.env.DATABASE_URL);
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
          refreshToken: refreshToken,
        },
      });

      if (!user) {
        return c.json(
          { error: "User not found or invalid refresh token" },
          401
        );
      }

      const newAccessToken = await sign({ userId: user.id }, c.env.JWT_SECRET);
      const newRefreshToken = await sign(
        { userId: user.id, type: "refresh" },
        c.env.JWT_SECRET
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      setAuthCookies(c, newAccessToken, newRefreshToken);
      c.set("user", { id: user.id, email: user.email });
    } else if (!accessToken || !refreshToken) {
      return c.json({ error: "Authorization tokens missing" }, 401);
    } else {
      // Handle access token validation
      const payload = (await verify(accessToken, c.env.JWT_SECRET)) as {
        userId: number;
      };

      prisma = await createPrismaClient(c.env.DATABASE_URL);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 401);
      }

      c.set("user", { id: user.id, email: user.email });
    }

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (!accessToken && refreshToken) {
      return c.json({ error: "Session refresh failed" }, 401);
    } else {
      return c.json({ error: "Invalid access token" }, 401);
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};
