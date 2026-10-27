import { EstadoVacio } from "@/components/ui/estado-vacio";
import { House } from "lucide-react";

export default function Inicio() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Inicio</h1>
      <EstadoVacio
        icono={House}
        mensaje="Aquí verás un resumen de tus finanzas"
      />
    </div>
  );
}
