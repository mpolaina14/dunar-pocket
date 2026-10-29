import { db } from "@/db/client";
import * as schema from "@/db/schema/autenticacion";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      rol: {
        type: "string",
        required: false,
        defaultValue: "usuario",
        input: false,
      },
    },
  },
  rateLimit: {
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
  plugins: [nextCookies()],
});
