"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../cliente";

export function BotonCerrarSesion() {
  const router = useRouter();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState(false);

  async function cerrarSesion() {
    setError(false);
    setPendiente(true);

    let fallo = false;
    try {
      const { error } = await authClient.signOut();
      fallo = Boolean(error);
    } catch {
      fallo = true;
    }

    if (fallo) {
      setError(true);
      setPendiente(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={cerrarSesion}
        disabled={pendiente}
        className="flex min-h-11 min-w-11 flex-row items-center justify-start gap-1 rounded-lg px-3 py-1 text-xs text-muted hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60 md:gap-3 md:px-4 md:text-base"
      >
        <LogOut aria-hidden="true" className="size-6 shrink-0" />
        <span className="hidden md:block">
          {pendiente ? "Cerrando sesión..." : "Cerrar sesión"}
        </span>
      </button>
      {error && (
        <p
          role="alert"
          className="absolute top-full right-0 z-20 mt-2 w-max max-w-64 rounded-lg border border-border bg-background p-3 text-sm text-danger md:top-auto md:right-auto md:bottom-full md:left-0 md:mb-2"
        >
          No se ha podido cerrar la sesión. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
