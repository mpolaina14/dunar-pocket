const formateadorEuros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});

export function formatearEuros(centimos: number): string {
  return formateadorEuros.format(centimos / 100);
}
