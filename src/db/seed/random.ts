export type Aleatorio = {
  siguiente: () => number;
  entero: (min: number, max: number) => number;
  elegir: <T>(lista: readonly T[]) => T;
};

// Generador mulberry32: la misma semilla produce siempre la misma secuencia.
export function crearAleatorio(semilla: number): Aleatorio {
  let estado = semilla >>> 0;

  function siguiente(): number {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    siguiente,
    entero: (min, max) => min + Math.floor(siguiente() * (max - min + 1)),
    elegir: (lista) => lista[Math.floor(siguiente() * lista.length)],
  };
}
