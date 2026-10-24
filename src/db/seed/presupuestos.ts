import { ultimosMeses } from "./meses";

export type PresupuestoSemilla = {
  categoria: string | null;
  mes: string;
  importeCentimos: number;
};

const limitesPorCategoria: [string, number][] = [
  ["Supermercado", 60000],
  ["Restaurantes", 20000],
  ["Ocio", 15000],
  ["Transporte", 15000],
];

const LIMITE_GLOBAL = 195000;

export function generarPresupuestos(hoy: string): PresupuestoSemilla[] {
  const resultado: PresupuestoSemilla[] = [];

  for (const mes of ultimosMeses(hoy, 12)) {
    resultado.push({ categoria: null, mes, importeCentimos: LIMITE_GLOBAL });

    for (const [categoria, importeCentimos] of limitesPorCategoria) {
      resultado.push({ categoria, mes, importeCentimos });
    }
  }

  return resultado;
}
