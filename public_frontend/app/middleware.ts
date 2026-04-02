import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value
  const { pathname } = request.nextUrl

  // Rutas protegidas
  if (pathname.startsWith("/admin/panel")) {
    if (!access) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
