import { EstadoVacio } from "@/components/ui/estado-vacio";
import { PiggyBank } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presupuestos",
};

export default function Presupuestos() {
  return (
    <>
      <h1>Presupuestos</h1>
      <EstadoVacio icono={PiggyBank} mensaje="Aún no hay presupuestos" />
    </>
  );
}
