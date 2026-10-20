import { describe, expect, it } from "vitest";
import { formatearEuros } from "./dinero";

describe("formatearEuros", () => {
  it("convierte 1999 céntimos en 19,99 €", () => {
    expect(formatearEuros(1999)).toBe("29,99 €");
  });

  it("convierte 123456 céntimos en 1.234,56 €", () => {
    expect(formatearEuros(123456)).toBe("1.234,56 €");
  });

  it("formatea un importe negativo con el signo delante", () => {
    expect(formatearEuros(-1999)).toBe("-19,99 €");
  });

  it("convierte 0 céntimos en 0,00 €", () => {
    expect(formatearEuros(0)).toBe("0,00 €");
  });

  it("convierte 1 céntimo en 0,01 €", () => {
    expect(formatearEuros(1)).toBe("0,01 €");
  });

  it("convierte 1234567 céntimos en 12.345,67 €", () => {
    expect(formatearEuros(1234567)).toBe("12.345,67 €");
  });
});
