import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./autenticacion";
import { categorias } from "./categorias";

export const movimientos = pgTable(
  "movimientos",
  {
    id: uuid().primaryKey().defaultRandom(),
    usuarioId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoriaId: uuid()
      .notNull()
      .references(() => categorias.id, { onDelete: "restrict" }),
    importeCentimos: integer().notNull(),
    fecha: date({ mode: "string" }).notNull(),
    nota: varchar({ length: 140 }),
    creadoEn: timestamp({ withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("movimientos_importe_positivo", sql`${t.importeCentimos} > 0`),
    index("movimientos_usuario_fecha_idx").on(t.usuarioId, t.fecha),
  ],
);
