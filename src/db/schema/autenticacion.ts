import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const rolUsuario = pgEnum("rol_usuario", ["usuario", "administrador"]);

// Tabla que espera Better Auth (campos de la librería) más nuestro rol.
export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  rol: rolUsuario().notNull().default("usuario"),
});
