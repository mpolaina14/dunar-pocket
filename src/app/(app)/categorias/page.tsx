import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Tags } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías",
};

export default function Categorias() {
  return (
    <>
      <h1>Categorías</h1>
      <EstadoVacio icono={Tags} mensaje="Aún no hay categorías" />
    </>
  );
}
