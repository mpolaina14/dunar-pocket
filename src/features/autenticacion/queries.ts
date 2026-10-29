import { auth } from "@/features/autenticacion/auth";
import { headers } from "next/headers";
import "server-only";

export async function obtenerSesion() {
  return auth.api.getSession({ headers: await headers() });
}
