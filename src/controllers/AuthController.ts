import { Context } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";

const login = async (context: Context) => {
  const { supabaseAnon, supabaseService } = getSupabaseClient(context);
  const { email, password } = await context.req.json<{
    email: string;
    password: string;
  }>();

  const { data, error } = await supabaseService.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return context.json({ error: error.message }, 400);
  }

  const accessToken = data.session?.access_token;
  const refreshToken = data.session?.refresh_token;

  if (!accessToken || !refreshToken) {
    return context.json({ error: "Token creation failed" }, 500);
  }

  return context.json({ accessToken, refreshToken }, 200);
};

const register = async (context: Context) => {
  const { supabaseAnon } = getSupabaseClient(context);
  const { email, password } = await context.req.json<{
    email: string;
    password: string;
  }>();

  const { data, error } = await supabaseAnon.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    return context.json({ error: error.message }, 400);
  }

  return context.json({ message: "User registered successfully" }, 201);
};

export { login, register };
