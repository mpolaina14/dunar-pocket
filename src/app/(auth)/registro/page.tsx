import FormularioRegistro from "@/features/autenticacion/formulario-registro";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function Registro() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center">Crear cuenta</h1>
      <FormularioRegistro />
      <p className="text-center">
        ¿Ya tienes cuenta?
        <Link href="/login" className="ml-1 font-bold">
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
