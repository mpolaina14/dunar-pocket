import { BarraInferior } from "@/components/layout/barra-inferior";
import { BarraLateral } from "@/components/layout/barra-lateral";
import { Cabecera } from "@/components/layout/cabecera";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-20 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-2 focus:outline-focus"
      >
        Saltar al contenido
      </a>
      <div className="flex flex-1 flex-col md:flex-row">
        <Cabecera />
        <BarraLateral />
        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto w-full max-w-5xl flex-1 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] focus:outline-none md:p-8"
        >
          {children}
        </main>
        <BarraInferior />
      </div>
    </>
  );
}
