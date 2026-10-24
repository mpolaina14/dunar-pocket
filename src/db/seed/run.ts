import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { user } from "../schema/autenticacion";
import { categorias, categoriasPorDefecto } from "../schema/categorias";
import { movimientos } from "../schema/movimientos";
import { presupuestos } from "../schema/presupuestos";
import { categoriasSemilla } from "./categorias";
import { generarMovimientos } from "./movimientos";
import { generarPresupuestos } from "./presupuestos";
import { crearAleatorio } from "./random";

const SEMILLA = 2026;
const ID_DEMO = "usuario-demo";
const EMAIL_DEMO = "demo@dunar-pocket.test";

async function main() {
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("La semilla no se puede ejecutar en producción.");
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Falta la variable de entorno DATABASE_URL");
  }

  const db = drizzle({ client: neon(url), casing: "snake_case" });
  const hoy = new Date().toISOString().slice(0, 10);

  // Los ids de las categorías se generan aquí para poder enlazar los movimientos
  // y los presupuestos sin una consulta intermedia.
  const filasCategorias = categoriasSemilla.map((categoria) => ({
    ...categoria,
    id: crypto.randomUUID(),
    usuarioId: ID_DEMO,
  }));
  const idPorNombre = new Map(filasCategorias.map((c) => [c.nombre, c.id]));

  function idDe(nombre: string): string {
    const id = idPorNombre.get(nombre);
    if (!id) throw new Error(`Categoría desconocida: ${nombre}`);
    return id;
  }

  const filasMovimientos = generarMovimientos(hoy, crearAleatorio(SEMILLA)).map(
    (m) => ({
      usuarioId: ID_DEMO,
      categoriaId: idDe(m.categoria),
      importeCentimos: m.importeCentimos,
      fecha: m.fecha,
      nota: m.nota,
    }),
  );

  const filasPresupuestos = generarPresupuestos(hoy).map((p) => ({
    usuarioId: ID_DEMO,
    categoriaId: p.categoria === null ? null : idDe(p.categoria),
    mes: p.mes,
    importeCentimos: p.importeCentimos,
  }));

  // Las plantillas del administrador: no se repiten si ya existen.
  await db
    .insert(categoriasPorDefecto)
    .values(categoriasSemilla.map((c) => ({ ...c })))
    .onConflictDoNothing({ target: categoriasPorDefecto.nombre });

  // Un batch se ejecuta como una sola transacción: o entra todo o no entra nada.
  await db.batch([
    db.delete(user).where(eq(user.email, EMAIL_DEMO)),
    db.insert(user).values({
      id: ID_DEMO,
      name: "Ana Demo",
      email: EMAIL_DEMO,
      emailVerified: true,
    }),
    db.insert(categorias).values(filasCategorias),
    db.insert(movimientos).values(filasMovimientos),
    db.insert(presupuestos).values(filasPresupuestos),
  ]);

  console.log(
    `Semilla aplicada: ${filasCategorias.length} categorías, ` +
      `${filasMovimientos.length} movimientos, ${filasPresupuestos.length} presupuestos.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
