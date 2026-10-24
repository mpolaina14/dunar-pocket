import { describe, expect, it } from "vitest";
import { ultimosMeses } from "./meses";

describe("ultimosMeses", () => {
  it("devuelve 12 meses, del más antiguo al actual, en día 1", () => {
    const meses = ultimosMeses("2026-10-24", 12);

    expect(meses).toHaveLength(12);
    expect(meses[0]).toBe("2025-11-01");
    expect(meses[11]).toBe("2026-10-01");
  });

  it("cruza el cambio de año", () => {
    expect(ultimosMeses("2026-02-15", 3)).toEqual([
      "2025-12-01",
      "2026-01-01",
      "2026-02-01",
    ]);
  });

  it("con cantidad 1 devuelve solo el mes actual", () => {
    expect(ultimosMeses("2026-10-24", 1)).toEqual(["2026-10-01"]);
  });
});
