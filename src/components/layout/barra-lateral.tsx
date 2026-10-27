"use client";

import Link from "next/link";
import { EnlaceNav } from "./enlace-nav";
import { enlaces } from "./enlaces";

export function BarraLateral() {
  return (
    <nav
      aria-label="Principal"
      className="sticky top-0 hidden h-dvh w-64 flex-col gap-y-4 border-r border-border bg-background p-4 md:flex"
    >
      <Link
        href="/"
        className="flex min-h-11 items-center text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        DUNAR Pocket
      </Link>
      <ul className="flex flex-col gap-1">
        {enlaces.map((enlace) => (
          <li key={enlace.ruta}>
            <EnlaceNav {...enlace} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
