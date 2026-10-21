export type EstadoPresupuesto = "en-rango" | "cerca" | "superado";

/**
 * Estado de un presupuesto según lo gastado respecto a su límite.
 *
 * - "en-rango": menos del 80 % del límite.
 * - "cerca": desde el 80 % hasta el 100 % del límite, ambos incluidos.
 * - "superado": más del 100 % del límite.
 *
 * Ambos importes son céntimos enteros. Se compara sin dividir para no
 * depender de decimales en coma flotante.
 *
 * Lanza RangeError si los importes no son válidos: un límite de 0 o
 * negativo no es un presupuesto, y debe rechazarse al validar la entrada.
 */
export function calcularEstadoPresupuesto(
  gastado: number,
  limite: number,
): EstadoPresupuesto {
  if (!Number.isSafeInteger(gastado) || gastado < 0) {
    throw new RangeError("El gasto debe ser un entero de céntimos, 0 o más.");
  }
  if (!Number.isSafeInteger(limite) || limite <= 0) {
    throw new RangeError(
      "El límite debe ser un entero de céntimos mayor que 0.",
    );
  }

  if (gastado * 100 > limite * 100) {
    return "superado";
  }
  if (gastado * 100 >= limite * 80) {
    return "cerca";
  }
  return "en-rango";
}
