export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto w-full max-w-sm flex-1 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] focus:outline-none md:p-8"
    >
      {children}
    </main>
  );
}
