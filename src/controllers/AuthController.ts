import { Context } from "hono";
import { deleteCookie } from "hono/cookie";
import { setAuthCookies } from "../helpers";
import { createPrismaClient } from "../db/prismaClient";
import { sign, verify } from "hono/jwt";
import { Prisma, User } from "@prisma/client";

// Web Crypto API password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

const register = async (c: Context) => {
  let prisma = null;
  try {
    console.log("Register endpoint hit");

    const { email, password }: Prisma.UserCreateInput = await c.req.json<{
      email: string;
      password: string;
    }>();
    console.log("Received registration request for email:", email);

    console.log("Creating Prisma client with URL:", c.env.DATABASE_URL);
    prisma = await createPrismaClient(c.env.DATABASE_URL);
    console.log("Prisma client created");

    console.log("Checking for existing user");
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });
    console.log(
      "Existing user check complete:",
      existingUser ? "found" : "not found"
    );

    if (existingUser) {
      return c.json({ error: "Email already registered" }, 400);
    }

    console.log("Hashing password");
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed");

    console.log("Creating new user");
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log("User created successfully");

    return c.json({ message: "User registered successfully 🍻" }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({ error: "Registration failed", details: errorMessage }, 500);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

const login = async (c: Context) => {
  let prisma = null;
  try {
    const { email, password }: Prisma.UserWhereUniqueInput = await c.req.json<{
      email: string;
      password: string;
    }>();

    prisma = await createPrismaClient(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 400);
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 400);
    }

    const accessToken = await sign({ userId: user.id }, c.env.JWT_SECRET);
    const refreshToken = await sign(
      { userId: user.id, type: "refresh" },
      c.env.JWT_SECRET
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    setAuthCookies(c, accessToken, refreshToken);

    return c.json(
      { message: "Login successful ⚡️", accessToken, refreshToken },
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({ error: "Login failed", details: errorMessage }, 500);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

const logout = async (c: Context) => {
  let prisma = null;
  try {
    const accessToken = c.get("accessToken");
    if (accessToken) {
      const payload = (await verify(accessToken, c.env.JWT_SECRET)) as {
        userId: number;
      };
      prisma = await createPrismaClient(c.env.DATABASE_URL);
      const user: User | null = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (user) {
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      }
    }

    deleteCookie(c, "accessToken");
    deleteCookie(c, "refreshToken");
    return c.json({ message: "Logout successful 🍻" }, 200);
  } catch (error) {
    console.error("Logout error:", error);
    // Still return success for logout even if there's an error
    return c.json({ message: "Logout successful 🍻" }, 200);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

export { login, register, logout };
