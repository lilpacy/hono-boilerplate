import { Context, Next } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const { supabaseAnon } = getSupabaseClient(ctx);

  const authHeader = ctx.req.header("Authorization");
  if (!authHeader) {
    return ctx.json({ error: "Authorization header missing" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabaseAnon.auth.getUser(token);

  if (error || !data.user) {
    return ctx.json({ error: "Unauthorized" }, 401);
  }

  ctx.set("user", data.user);
  await next();
};
