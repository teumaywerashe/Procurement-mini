import { NextRequest, NextResponse } from "next/server";

// Decode JWT payload without verifying signature (good enough for routing)
function decodeJwtPayload(token: string): { uid?: number; role?: string } | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Routes that require any authenticated user
const AUTH_ROUTES = [
  "/dashboard",
  "/tender/manage",
  "/tender/create",
  "/bids/my",
  "/profile",
];

// Routes that require Admin role
const ADMIN_ROUTES = [
  "/vendors",
  "/bids",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const isLoggedIn = !!payload?.uid;
  const isAdmin = payload?.role === "Admin";

  // Check admin-only routes
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (!isAdmin)    return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  // Check auth-required routes (also catches /tender/[id]/edit)
  const isProtected =
    AUTH_ROUTES.some((r) => pathname.startsWith(r)) ||
    /^\/tender\/[^/]+\/edit/.test(pathname);

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-logged-in users away from login/register
  if (isLoggedIn && (pathname === "/login" || pathname === "/registration")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tender/manage/:path*",
    "/tender/create/:path*",
    "/tender/:path*/edit",
    "/bids/:path*",
    "/vendors/:path*",
    "/profile/:path*",
    "/login",
    "/registration",
  ],
};
