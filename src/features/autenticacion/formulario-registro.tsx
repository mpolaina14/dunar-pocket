"use client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import React, { useActionState, useState } from "react";
import { z } from "zod";
import { type EstadoRegistro, registrar } from "./acciones";
import { esquemaRegistro } from "./esquemas";

const estadoInicial: EstadoRegistro = {
  errores: {},
  errorGeneral: "",
  valores: { nombre: "", email: "" },
};

export default function FormularioRegistro() {
  const [estado, accion, pendiente] = useActionState(registrar, estadoInicial);
  const [erroresCliente, setErroresCliente] = useState<
    EstadoRegistro["errores"]
  >({});

  function alEnviar(evento: React.SyntheticEvent<HTMLFormElement>) {
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    const resultado = esquemaRegistro.safeParse(datos);

    if (!resultado.success) {
      evento.preventDefault();
      setErroresCliente(z.flattenError(resultado.error).fieldErrors);
      return;
    }
    setErroresCliente({});
  }

  return (
    <Form
      onSubmit={alEnviar}
      action={accion}
      validationBehavior="aria"
      validationErrors={
        Object.keys(erroresCliente).length > 0 ? erroresCliente : estado.errores
      }
      className="flex flex-col gap-4"
    >
      <TextField name="nombre" type="text" defaultValue={estado.valores.nombre}>
        <Label>Nombre</Label>
        <Input autoComplete="name" placeholder="Tu nombre" />
        <FieldError />
      </TextField>
      <TextField name="email" type="email" defaultValue={estado.valores.email}>
        <Label>Email</Label>
        <Input autoComplete="email" placeholder="Tu email" />
        <FieldError />
      </TextField>
      <TextField name="password" type="password">
        <Label>Contraseña</Label>
        <Input autoComplete="new-password" placeholder="Contraseña" />
        <Description>Mínimo 8 caracteres</Description>
        <FieldError />
      </TextField>
      {estado.errorGeneral !== "" && <p role="alert">{estado.errorGeneral}</p>}
      <Button type="submit" isDisabled={pendiente} className="w-full">
        {pendiente ? "Creando cuenta..." : "Crear"}
      </Button>
    </Form>
  );
}
