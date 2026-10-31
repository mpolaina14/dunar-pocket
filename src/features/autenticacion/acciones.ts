"use server";

import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "./auth";
import { esquemaRegistro } from "./esquemas";

export type EstadoRegistro = {
  errores: {
    nombre?: string[];
    email?: string[];
    password?: string[];
  };
  errorGeneral: string;
  valores: {
    nombre: string;
    email: string;
  };
};

export async function registrar(
  _estadoPrevio: EstadoRegistro,
  formData: FormData,
): Promise<EstadoRegistro> {
  const datos = Object.fromEntries(formData);
  const valores = {
    nombre: String(datos.nombre ?? ""),
    email: String(datos.email ?? ""),
  };

  const resultado = esquemaRegistro.safeParse(datos);
  if (!resultado.success) {
    return {
      errores: z.flattenError(resultado.error).fieldErrors,
      errorGeneral: "",
      valores,
    };
  }

  try {
    const { nombre, email, password } = resultado.data;
    await auth.api.signUpEmail({
      body: {
        name: nombre,
        email,
        password,
      },
    });
  } catch (error) {
    if (
      error instanceof APIError &&
      error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    ) {
      return {
        errores: { email: ["Ya existe una cuenta con este email"] },
        errorGeneral: "",
        valores,
      };
    }
    return {
      errores: {},
      errorGeneral: "No hemos podido crear la cuenta. Inténtalo de nuevo",
      valores,
    };
  }
  redirect("/");
}
