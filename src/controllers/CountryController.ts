import { Context } from "hono";
import { createPrismaClient } from "../db/prismaClient";
import { Country } from "@prisma/client";

const getCountries = async (c: Context) => {
  let prisma = null;
  try {
    prisma = await createPrismaClient(c.env.DATABASE_URL);
    const countries: Country[] = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        iso2: true,
        iso3: true,
        localName: true,
        continent: true,
      },
    });
    return c.json(countries, 200);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return c.json({ error: "Failed to fetch countries" }, 400);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

const getCountry = async (c: Context) => {
  const { id } = c.req.param();
  let prisma = null;
  try {
    prisma = await createPrismaClient(c.env.DATABASE_URL);
    const country: Country | null = await prisma.country.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        iso2: true,
        iso3: true,
        localName: true,
        continent: true,
      },
    });
    if (!country) {
      return c.json({ error: "Country not found" }, 404);
    }
    return c.json(country, 200);
  } catch (error) {
    console.error("Error fetching country:", error);
    return c.json({ error: "Failed to fetch country" }, 400);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};

export { getCountries, getCountry };
