import { Context } from "hono";
import { getSupabaseClient } from "../db/supabaseClient";

const getCountries = async (c: Context) => {
  let { data: countries, error } = await getSupabaseClient(c)
    .supabaseAnon.from("countries")
    .select("id, name, iso2, iso3, local_name, continent");

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json(countries, 200);
};

const getCountry = async (c: Context) => {
  const { id } = c.req.param();
  let { data: country, error } = await getSupabaseClient(c)
    .supabaseAnon.from("countries")
    .select("id, name, iso2, iso3, local_name, continent")
    .eq("id", id)
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json(country, 200);
};

export { getCountries, getCountry };
