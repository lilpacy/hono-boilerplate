import { Context } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";

const getUsers = async () => {
  const data = { data: [{ id: "1", email: "goktugcy@gmail.com" }] };
  return data;
};

const getTest = async (ctx: Context) => {
  const { data, error } = await getSupabaseClient(ctx)
    .supabaseAnon.from("announcements")
    .select("*");
  if (error) {
    return error;
  }
  return data;
};

export const AuthController = {
  getUsers,
  getTest,
};
