import { ultimosMeses } from "./meses";
import type { Aleatorio } from "./random";

export type MovimientoSemilla = {
  categoria: string;
  importeCentimos: number;
  fecha: string;
  nota: string | null;
};

type Perfil = {
  categoria: string;
  veces: [number, number];
  importe: [number, number];
  dia?: [number, number];
  notas?: string[];
};

const perfiles: Perfil[] = [
  {
    categoria: "Nómina",
    veces: [1, 1],
    importe: [185000, 185000],
    dia: [28, 28],
    notas: ["Nómina del mes"],
  },
  { categoria: "Otros ingresos", veces: [0, 1], importe: [3000, 25000] },
  {
    categoria: "Vivienda",
    veces: [1, 1],
    importe: [72000, 72000],
    dia: [1, 5],
    notas: ["Alquiler"],
  },
  { categoria: "Supermercado", veces: [8, 12], importe: [1500, 9500] },
  { categoria: "Transporte", veces: [3, 6], importe: [800, 6000] },
  { categoria: "Restaurantes", veces: [2, 6], importe: [1200, 5500] },
  { categoria: "Ocio", veces: [1, 4], importe: [1000, 6000] },
  { categoria: "Salud", veces: [0, 2], importe: [1500, 8000] },
  {
    categoria: "Suscripciones",
    veces: [2, 3],
    importe: [699, 1599],
    dia: [1, 10],
    notas: ["Música", "Vídeo", "Almacenamiento"],
  },
  { categoria: "Ropa", veces: [0, 2], importe: [2000, 12000] },
];

export function generarMovimientos(
  hoy: string,
  aleatorio: Aleatorio,
): MovimientoSemilla[] {
  const resultado: MovimientoSemilla[] = [];

  for (const mes of ultimosMeses(hoy, 12)) {
    for (const perfil of perfiles) {
      const veces = aleatorio.entero(perfil.veces[0], perfil.veces[1]);

      for (let i = 0; i < veces; i++) {
        const [diaMin, diaMax] = perfil.dia ?? [1, 28];
        const dia = aleatorio.entero(diaMin, diaMax);
        const fecha = `${mes.slice(0, 8)}${String(dia).padStart(2, "0")}`;

        if (fecha > hoy) continue;

        resultado.push({
          categoria: perfil.categoria,
          importeCentimos: aleatorio.entero(
            perfil.importe[0],
            perfil.importe[1],
          ),
          fecha,
          nota: perfil.notas ? aleatorio.elegir(perfil.notas) : null,
        });
      }
    }
  }

  return resultado;
}
