import { Context } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";
import { deleteCookie } from "hono/cookie";
import { setAuthCookies } from "../helper";

const login = async (c: Context) => {
  const { supabaseAnon, supabaseService } = getSupabaseClient(c);
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const { data, error } = await supabaseService.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  const accessToken = data.session?.access_token
  const refreshToken = data.session?.refresh_token;

  if (!accessToken || !refreshToken) {
    return c.json({ error: "Token creation failed" }, 500);
  }

  setAuthCookies(c, accessToken, refreshToken);

  return c.json({ message: "Login successful" }, 200);
};

const register = async (c: Context) => {
  const { supabaseAnon } = getSupabaseClient(c);
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const { data, error } = await supabaseAnon.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({ message: "User registered successfully" }, 201);
};

const logout = async (c: Context) => {
  deleteCookie(c, "accessToken");
  deleteCookie(c, "refreshToken");
  return c.json({ message: "Logout successful" }, 200);
};

export { login, register, logout };
