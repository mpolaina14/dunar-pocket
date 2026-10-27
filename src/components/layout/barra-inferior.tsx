"use client";

import { EnlaceNav } from "./enlace-nav";
import { enlaces } from "./enlaces";

export function BarraInferior() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {enlaces.map((enlace) => (
          <li key={enlace.ruta}>
            <EnlaceNav {...enlace} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
