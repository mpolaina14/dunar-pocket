"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { authClient } from "./cliente";
import { esquemaLogin } from "./esquemas";

type ErroresLogin = {
  email?: string[];
  password?: string[];
};

export default function FormularioLogin() {
  const router = useRouter();
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [pendiente, setPendiente] = useState(false);

  async function alEnviar(evento: React.SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorGeneral("");

    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    const resultado = esquemaLogin.safeParse(datos);

    if (!resultado.success) {
      setErrores(z.flattenError(resultado.error).fieldErrors);
      return;
    }
    setErrores({});

    setPendiente(true);
    const { error } = await authClient.signIn.email(resultado.data);
    setPendiente(false);

    if (error) {
      setErrorGeneral(
        error.status === 429
          ? "Demasiados intentos. Espera un minuto e inténtalo de nuevo."
          : "Email o contraseña incorrectos",
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Form
      onSubmit={alEnviar}
      validationBehavior="aria"
      validationErrors={errores}
      className="flex flex-col gap-4"
    >
      <TextField name="email" type="email">
        <Label>Email</Label>
        <Input autoComplete="email" placeholder="Tu email" />
        <FieldError />
      </TextField>
      <TextField name="password" type="password">
        <Label>Contraseña</Label>
        <Input autoComplete="current-password" placeholder="Contraseña" />
        <FieldError />
      </TextField>
      {errorGeneral !== "" && <p role="alert">{errorGeneral}</p>}
      <Button type="submit" isDisabled={pendiente} className="w-full">
        {pendiente ? "Iniciando sesión..." : "Entrar"}
      </Button>
    </Form>
  );
}
