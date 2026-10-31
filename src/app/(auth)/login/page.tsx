import FormularioLogin from "@/features/autenticacion/formulario-login";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function Login() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center">Iniciar sesión</h1>
      <FormularioLogin />
      <p className="text-center">
        ¿Aún no tienes cuenta?
        <Link href="/registro" className="ml-1 font-bold">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
