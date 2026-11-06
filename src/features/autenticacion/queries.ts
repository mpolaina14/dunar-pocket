import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";
import { auth } from "./auth";

export const obtenerSesion = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function exigirSesion() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/api/sesion-invalida");
  return sesion;
}
