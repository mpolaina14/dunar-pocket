// Devuelve los últimos `cantidad` meses hasta el de `hoy` (formato AAAA-MM-DD),
// del más antiguo al más reciente, como el día 1 de cada mes.
export function ultimosMeses(hoy: string, cantidad: number): string[] {
  const anio = Number(hoy.slice(0, 4));
  const mes = Number(hoy.slice(5, 7));
  const meses: string[] = [];

  for (let atras = cantidad - 1; atras >= 0; atras--) {
    const indice = anio * 12 + (mes - 1) - atras;
    const a = Math.floor(indice / 12);
    const m = (indice % 12) + 1;
    meses.push(`${a}-${String(m).padStart(2, "0")}-01`);
  }

  return meses;
}
