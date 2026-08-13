import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(
  token: string,
): { uid?: number; role?: string; exp?: number } | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AUTH_ROUTES = ["/dashboard", "/profile"];

const ADMIN_ROUTES = ["/tenders/manage", "bids/:","/tenders/create"];

const SUPER_ADMIN_ROUTES = ["/vendors", "/users"];

const VENDOR_ROUTES = ["/bids/my"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  // payload ={uid,name,email,role}

  // Check if token is expired
  const isTokenExpired =
    payload && payload.exp ? payload.exp * 1000 < Date.now() : false;
  const isLoggedIn = !!payload?.uid && !isTokenExpired;
  const role = payload?.role;

  const isAdmin = role === "Admin" || role === "SuperAdmin";
  const isSuperAdmin = role === "SuperAdmin";
  const isVendor = role === "Vendor";

  const isSuperAdminRoute = SUPER_ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isSuperAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  const isAdminRoute =
    ADMIN_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/bids" ||
    /^\/tenders\/[^/]+\/edit$/.test(pathname);

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
    "/tenders/manage/:path*",
    "/tenders/create/:path*",
    "/tenders/:path*/edit",
    "/tenders/:path*",
    "/dashboard/:path*",
    "/vendors/:path*",
    "/profile/:path*",
    "/bids/:path*",
    "/registration",
    "/login",
    "/",
  ],
};
