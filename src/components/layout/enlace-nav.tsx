"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  ruta: string;
  etiqueta: string;
  icono: LucideIcon;
};

export function EnlaceNav({ ruta, etiqueta, icono: Icono }: Props) {
  const pathname = usePathname();

  const activo =
    ruta === "/"
      ? pathname === "/"
      : pathname === ruta || pathname.startsWith(`${ruta}/`);

  return (
    <Link
      href={ruta}
      aria-current={activo ? "page" : undefined}
      className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:flex-row md:justify-start md:gap-3 md:px-4 md:text-base ${
        activo
          ? "bg-surface-secondary font-semibold text-foreground"
          : "text-muted hover:bg-surface-secondary hover:text-foreground"
      }`}
    >
      <Icono aria-hidden="true" className="size-6 shrink-0" />
      {etiqueta}
    </Link>
  );
}
