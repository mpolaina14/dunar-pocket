import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import "server-only";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

export const db = drizzle({ client: neon(url), casing: "snake_case" });
