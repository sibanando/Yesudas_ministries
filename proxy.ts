import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const ADMIN_PATTERN = /^\/admin(\/.*)?$/;
const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!ADMIN_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  const payload = await decrypt(token);
  const isLoggedIn = Boolean(payload?.adminId);

  if (pathname === LOGIN_PATH) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
