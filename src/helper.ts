import { Context } from "hono";
import { setCookie } from "hono/cookie";

export const setAuthCookies = (
  c: Context,
  accessToken: string,
  refreshToken: string
) => {
  setCookie(c, "accessToken", accessToken, {
    httpOnly: true,
    secure: c.env.STAGE === "production",
    sameSite: "Strict",
    maxAge: 60 * 60, // 1 hour
  });

  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: c.env.STAGE === "production",
    sameSite: "Strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};
