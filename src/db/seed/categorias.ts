export type CategoriaSemilla = {
  nombre: string;
  tipo: "gasto" | "ingreso";
  color: string;
  icono: string;
};

export const categoriasSemilla: readonly CategoriaSemilla[] = [
  { nombre: "Vivienda", tipo: "gasto", color: "#6366f1", icono: "home" },
  {
    nombre: "Supermercado",
    tipo: "gasto",
    color: "#22c55e",
    icono: "shopping-cart",
  },
  { nombre: "Transporte", tipo: "gasto", color: "#f59e0b", icono: "car" },
  {
    nombre: "Restaurantes",
    tipo: "gasto",
    color: "#f97316",
    icono: "utensils",
  },
  { nombre: "Ocio", tipo: "gasto", color: "#ec4899", icono: "ticket" },
  { nombre: "Salud", tipo: "gasto", color: "#ef4444", icono: "heart-pulse" },
  { nombre: "Suscripciones", tipo: "gasto", color: "#8b5cf6", icono: "repeat" },
  { nombre: "Ropa", tipo: "gasto", color: "#0ea5e9", icono: "shirt" },
  { nombre: "Nómina", tipo: "ingreso", color: "#10b981", icono: "banknote" },
  {
    nombre: "Otros ingresos",
    tipo: "ingreso",
    color: "#14b8a6",
    icono: "piggy-bank",
  },
];
