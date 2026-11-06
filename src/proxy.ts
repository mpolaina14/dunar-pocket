import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const RUTAS_DE_ACCESO = ["/login", "/registro"];
const RUTAS_PUBLICAS = [...RUTAS_DE_ACCESO, "/design-test"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const haySesion = getSessionCookie(request) !== null;

  if (haySesion && RUTAS_DE_ACCESO.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!haySesion && !RUTAS_PUBLICAS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
