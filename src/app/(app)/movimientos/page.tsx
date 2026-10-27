import { EstadoVacio } from "@/components/ui/estado-vacio";
import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movimientos",
};

export default function Movimientos() {
  return (
    <>
      <h1>Movimientos</h1>
      <EstadoVacio icono={ArrowLeftRight} mensaje="Aún no hay movimientos" />
    </>
  );
}
