import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./autenticacion";

export const tipoCategoria = pgEnum("tipo_categoria", ["gasto", "ingreso"]);

// Plantillas que gestiona el administrador. Se copian a cada usuario al registrarse.
export const categoriasPorDefecto = pgTable("categorias_por_defecto", {
  id: uuid().primaryKey().defaultRandom(),
  nombre: text().notNull().unique(),
  tipo: tipoCategoria().notNull(),
  color: text().notNull(),
  icono: text().notNull(),
  creadaEn: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// Categorías de cada usuario. Se archivan, no se borran.
export const categorias = pgTable(
  "categorias",
  {
    id: uuid().primaryKey().defaultRandom(),
    usuarioId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    nombre: text().notNull(),
    tipo: tipoCategoria().notNull(),
    color: text().notNull(),
    icono: text().notNull(),
    archivadaEn: timestamp({ withTimezone: true }),
    creadaEn: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("categorias_usuario_nombre_uq").on(t.usuarioId, t.nombre)],
);
