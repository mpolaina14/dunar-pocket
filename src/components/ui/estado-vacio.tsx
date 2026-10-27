import type { LucideIcon } from "lucide-react";

type Props = {
  icono: LucideIcon;
  mensaje: string;
};
export function EstadoVacio({ mensaje, icono: Icono }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-fit rounded-full bg-surface-secondary p-2">
        <Icono aria-hidden="true" />
      </div>
      <p className="text-muted">{mensaje}</p>
    </div>
  );
}
