import { describe, expect, it } from "vitest";
import { categoriasSemilla } from "./categorias";
import { generarMovimientos } from "./movimientos";
import { crearAleatorio } from "./random";

const HOY = "2026-10-24";
const nombres = categoriasSemilla.map((c) => c.nombre);

function generar(semilla = 2026) {
  return generarMovimientos(HOY, crearAleatorio(semilla));
}

describe("generarMovimientos", () => {
  it("es repetible: la misma semilla da los mismos movimientos", () => {
    expect(generar(2026)).toEqual(generar(2026));
  });

  it("otra semilla da otros movimientos", () => {
    expect(generar(1)).not.toEqual(generar(2));
  });

  it("todos los importes son céntimos enteros mayores que 0", () => {
    for (const movimiento of generar()) {
      expect(Number.isInteger(movimiento.importeCentimos)).toBe(true);
      expect(movimiento.importeCentimos).toBeGreaterThan(0);
    }
  });

  it("ninguna fecha es posterior a hoy y todas caen en los últimos 12 meses", () => {
    for (const movimiento of generar()) {
      expect(movimiento.fecha <= HOY).toBe(true);
      expect(movimiento.fecha >= "2025-11-01").toBe(true);
    }
  });

  it("solo usa categorías del catálogo", () => {
    for (const movimiento of generar()) {
      expect(nombres).toContain(movimiento.categoria);
    }
  });

  it("hay una nómina en cada mes ya cerrado", () => {
    const nominas = generar().filter((m) => m.categoria === "Nómina");
    const meses = nominas.map((m) => m.fecha.slice(0, 7));

    // El mes actual aún no ha llegado al día 28.
    expect(meses).toHaveLength(11);
    expect(new Set(meses).size).toBe(11);
  });
});
