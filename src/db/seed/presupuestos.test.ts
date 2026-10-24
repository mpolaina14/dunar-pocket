import { describe, expect, it } from "vitest";
import { categoriasSemilla } from "./categorias";
import { generarPresupuestos } from "./presupuestos";

const HOY = "2026-10-24";
const nombres = categoriasSemilla.map((c) => c.nombre);

describe("generarPresupuestos", () => {
  const presupuestos = generarPresupuestos(HOY);

  it("hay un único presupuesto global por mes", () => {
    const globales = presupuestos.filter((p) => p.categoria === null);
    const meses = globales.map((p) => p.mes);

    expect(globales).toHaveLength(12);
    expect(new Set(meses).size).toBe(12);
  });

  it("no repite la pareja (categoría, mes)", () => {
    const claves = presupuestos.map((p) => `${p.categoria}|${p.mes}`);

    expect(new Set(claves).size).toBe(presupuestos.length);
  });

  it("el mes siempre es el día 1", () => {
    for (const presupuesto of presupuestos) {
      expect(presupuesto.mes.endsWith("-01")).toBe(true);
    }
  });

  it("importes en céntimos enteros mayores que 0 y categorías del catálogo", () => {
    for (const presupuesto of presupuestos) {
      expect(Number.isInteger(presupuesto.importeCentimos)).toBe(true);
      expect(presupuesto.importeCentimos).toBeGreaterThan(0);

      if (presupuesto.categoria !== null) {
        expect(nombres).toContain(presupuesto.categoria);
      }
    }
  });
});
