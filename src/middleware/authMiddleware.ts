import { Context, Next } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";
import { getCookie } from "hono/cookie";
import { setAuthCookies } from "../helper";

export const authMiddleware = async (c: Context, next: Next) => {
  const { supabaseAnon, supabaseService } = getSupabaseClient(c);

  const accessToken = getCookie(c, "accessToken");
  const refreshToken = getCookie(c, "refreshToken");

  if (!accessToken && refreshToken) {
    // A new access token is requested using the refresh token
    const { data, error } = await supabaseService.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return c.json({ error: "Session refresh failed" }, 401);
    }

    // Set the new access token and refresh token
    setAuthCookies(c, data.session.access_token, data.session.refresh_token);

    c.set("user", data.user);
  } else if (!accessToken || !refreshToken) {
    return c.json({ error: "Authorization tokens missing" }, 401);
  } else {
    const { data, error } = await supabaseAnon.auth.getUser(accessToken);

    if (error || !data.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", data.user);
  }

  await next();
};
