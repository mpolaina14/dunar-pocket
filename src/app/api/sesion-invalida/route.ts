import { auth } from "@/features/autenticacion/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cabeceras = await headers();
  const sesion = await auth.api.getSession({ headers: cabeceras });

  if (sesion) redirect("/");

  await auth.api.signOut({ headers: cabeceras });
  redirect("/login");
}
