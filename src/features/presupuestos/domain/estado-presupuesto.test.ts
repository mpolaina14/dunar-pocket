import { describe, expect, it } from "vitest";
import { calcularEstadoPresupuesto } from "./estado-presupuesto";

describe("calcularEstadoPresupuesto", () => {
  describe("estados y fronteras", () => {
    it("sin gastar nada está en rango", () => {
      expect(calcularEstadoPresupuesto(0, 10000)).toBe("en-rango");
    });

    it("justo por debajo del 80% sigue en rango", () => {
      expect(calcularEstadoPresupuesto(7999, 10000)).toBe("en-rango");
    });

    it("gastando 80% está cerca", () => {
      expect(calcularEstadoPresupuesto(8000, 10000)).toBe("cerca");
    });

    it("en el 100% está aún cerca", () => {
      expect(calcularEstadoPresupuesto(10000, 10000)).toBe("cerca");
    });

    it("un céntimo por encima del 100% está superado", () => {
      expect(calcularEstadoPresupuesto(10001, 10000)).toBe("superado");
    });

    it("muy por encima del límite sigue superado", () => {
      expect(calcularEstadoPresupuesto(50000, 10000)).toBe("superado");
    });
  });

  describe("límites pequeños y no redondos", () => {
    it("con límite de 5 céntimos, 3 está en rango y 4 (80%) está cerca", () => {
      expect(calcularEstadoPresupuesto(3, 5)).toBe("en-rango");
      expect(calcularEstadoPresupuesto(4, 5)).toBe("cerca");
    });

    it("con límite de 3 céntimos, 2 (66%) está en rango y 3 (100%) está cerca", () => {
      expect(calcularEstadoPresupuesto(2, 3)).toBe("en-rango");
      expect(calcularEstadoPresupuesto(3, 3)).toBe("cerca");
    });

    it("con límite de 1 céntimo, 0 está en rango, 1 cerca y 2 superado", () => {
      expect(calcularEstadoPresupuesto(0, 1)).toBe("en-rango");
      expect(calcularEstadoPresupuesto(1, 1)).toBe("cerca");
      expect(calcularEstadoPresupuesto(2, 1)).toBe("superado");
    });
  });

  describe("límites grandes", () => {
    it("mantiene las fronteras con un límite de 1.000.000,00 €", () => {
      const limite = 100_000_000;
      expect(calcularEstadoPresupuesto(79_999_999, limite)).toBe("en-rango");
      expect(calcularEstadoPresupuesto(80_000_000, limite)).toBe("cerca");
      expect(calcularEstadoPresupuesto(100_000_000, limite)).toBe("cerca");
      expect(calcularEstadoPresupuesto(100_000_001, limite)).toBe("superado");
    });
  });

  describe("importes no válidos", () => {
    it.each([0, -1, -10000, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
      "rechaza el límite %s",
      (limite) => {
        expect(() => calcularEstadoPresupuesto(100, limite)).toThrow(
          RangeError,
        );
      },
    );

    it.each([-1, -10000, 0.5, Number.NaN, Number.POSITIVE_INFINITY])(
      "rechaza el gasto %s",
      (gastado) => {
        expect(() => calcularEstadoPresupuesto(gastado, 10000)).toThrow(
          RangeError,
        );
      },
    );
  });
});
