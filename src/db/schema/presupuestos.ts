import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./autenticacion";
import { categorias } from "./categorias";

//categoriaId vacio = presupuesto global del mes.
export const presupuestos = pgTable(
  "presupuestos",
  {
    id: uuid().primaryKey().defaultRandom(),
    usuarioId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoriaId: uuid().references(() => categorias.id, {
      onDelete: "cascade",
    }),
    mes: date({ mode: "string" }).notNull(),
    importeCentimos: integer().notNull(),
    creadoEn: timestamp({ withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("presupuestos_importe_positivo", sql`${t.importeCentimos} > 0`),
    check("presupuestos_mes_dia_uno", sql`extract(day from ${t.mes}) = 1`),
    uniqueIndex("presupuestos_global_mes_uq")
      .on(t.usuarioId, t.mes)
      .where(sql`${t.categoriaId} is null`),
    uniqueIndex("presupuestos_categoria_mes_uq")
      .on(t.usuarioId, t.categoriaId, t.mes)
      .where(sql`${t.categoriaId} is not null`),
  ],
);
