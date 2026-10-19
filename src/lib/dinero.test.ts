import { describe, expect, it } from "vitest";
import { formatearEuros } from "./dinero";

describe("formatearEuros", () => {
  it("convierte 1999 céntimos en 19,99 €", () => {
    expect(formatearEuros(1999)).toBe("19,99\u00a0€");
  });
  it("convierte 123456 céntimos en 1.234,56 €", () => {
    expect(formatearEuros(123456)).toBe("1.234,56\u00a0€");
  });
  it("formatea un importe negativo con el signo delante", () => {
    expect(formatearEuros(-1999)).toBe("-19,99\u00a0€");
  });
});
