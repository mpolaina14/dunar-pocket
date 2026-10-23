import { defineConfig } from "drizzle-kit";

// Solo se ejecuta con los comandos de drizzle-kit (pnpm db:generate y
// pnpm db:migrate), siempre en local. Node 24 carga el archivo sin dependencias.
process.loadEnvFile(".env.local");

// Las migraciones usan la cadena directa de Neon (sin -pooler).
const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  throw new Error("Falta DATABASE_URL_UNPOOLED en .env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
