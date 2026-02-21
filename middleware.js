import { NextResponse } from "next/server"

export async function middleware(request) {
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")

  // Por ahora solo redirigimos si no hay cookie de supabase
  const supabaseCookie = request.cookies.getAll().find(c => c.name.startsWith("sb-"))

  if (!supabaseCookie && !isLoginPage && !isApiRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (supabaseCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}