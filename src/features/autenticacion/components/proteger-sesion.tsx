import type { ReactNode } from "react";
import { exigirSesion } from "../queries";

export async function ProtegerSesion({ children }: { children: ReactNode }) {
  await exigirSesion();
  return children;
}
