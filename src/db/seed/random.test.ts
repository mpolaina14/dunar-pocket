import { describe, expect, it } from "vitest";
import { crearAleatorio } from "./random";

function secuencia(semilla: number, cantidad: number): number[] {
  const aleatorio = crearAleatorio(semilla);
  return Array.from({ length: cantidad }, () => aleatorio.siguiente());
}

describe("crearAleatorio", () => {
  it("con la misma semilla produce la misma secuencia", () => {
    expect(secuencia(2026, 20)).toEqual(secuencia(2026, 20));
  });

  it("con semillas distintas produce secuencias distintas", () => {
    expect(secuencia(1, 20)).not.toEqual(secuencia(2, 20));
  });

  it("siguiente() devuelve valores en [0, 1)", () => {
    for (const valor of secuencia(7, 1000)) {
      expect(valor).toBeGreaterThanOrEqual(0);
      expect(valor).toBeLessThan(1);
    }
  });

  it("entero() respeta los límites e incluye ambos extremos", () => {
    const aleatorio = crearAleatorio(3);
    const valores = Array.from({ length: 1000 }, () => aleatorio.entero(3, 7));

    expect(Math.min(...valores)).toBe(3);
    expect(Math.max(...valores)).toBe(7);
  });

  it("elegir() devuelve un elemento de la lista", () => {
    const aleatorio = crearAleatorio(5);
    const lista = ["a", "b", "c"];

    for (let i = 0; i < 50; i++) {
      expect(lista).toContain(aleatorio.elegir(lista));
    }
  });
});
