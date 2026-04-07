import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Redirige www.oisan.dev → oisan.dev
  const host = request.headers.get("host");
  if (host === "www.oisan.dev") {
    const url = request.nextUrl.clone();
    url.host = "oisan.dev";
    return NextResponse.redirect(url, 301); // redirect permanente
  }

  // Rutas protegidas
  if (pathname.startsWith("/admin/panel")) {
    if (!access) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Aplica middleware a rutas protegidas + todas para www
export const config = {
  matcher: ["/admin/:path*", "/:path*"], // /:path* cubre todas para la redirección www
};