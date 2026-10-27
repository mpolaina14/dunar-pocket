import Link from "next/link";

export function Cabecera() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 pt-[env(safe-area-inset-top)] md:hidden">
      <Link
        href="/"
        className="flex min-h-11 items-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        DUNAR Pocket
      </Link>
    </header>
  );
}
