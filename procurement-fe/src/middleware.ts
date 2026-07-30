import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(
  token: string,
): { uid?: number; role?: string } | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AUTH_ROUTES = ["/dashboard", "/profile"];

const ADMIN_ROUTES = ["/tender/manage", "/tender/create", "/vendors"];

const VENDOR_ROUTES = ["/bids/my"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  const isLoggedIn = !!payload?.uid;
  const role = payload?.role;

  const isAdmin = role === "Admin";
  const isVendor = role === "Vendor";

  const isAdminRoute =
    ADMIN_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/bids" ||
    /^\/tender\/[^/]+\/edit$/.test(pathname);

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  const isVendorRoute = VENDOR_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isVendorRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!isVendor) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  const isProtected = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isLoggedIn &&
    (pathname === "/" || pathname === "/login" || pathname === "/registration")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tender/manage/:path*",
    "/tender/create/:path*",
    "/tender/:path*/edit",
    "/dashboard/:path*",
    "/vendors/:path*",
    "/profile/:path*",
    "/registration",
    "/bids/:path*",
    "/login",
    "/",
  ],
};
