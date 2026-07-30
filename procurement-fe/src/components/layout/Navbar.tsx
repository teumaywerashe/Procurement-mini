"use client";

import Link from "next/link";
import {
  IconBell,
  IconChevronDown,
  IconShoppingBag,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation"; // 1. Imported usePathname
import { useLogoutMutation } from "@/src/store/api/userApi";
import { logOut } from "@/src/store/auth/authSlice";
import type { RootState } from "@/src/store/store";
import { useTheme } from "@/src/components/ThemeProvider";

export default function Navbar() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); // 2. Get current active path
  const { theme, toggle } = useTheme();
  const [logoutApi] = useLogoutMutation();

  const navLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenders", href: "/tender" },
        ...(isVendor ? [{ label: "My Bids", href: "/bids/my" }] : []),
        ...(isAdmin
          ? [
              { label: "Manage", href: "/tender/manage" },
              { label: "Vendors", href: "/vendors" },
              { label: "Bids", href: "/bids" },
            ]
          : []),
      ]
    : [];

  async function handleLogout() {
    await logoutApi();
    dispatch(logOut());
    router.push("/");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="w-full  fixed right-0 left-0 ml-0 mr-0 bg-(--bg-base) border-b border-(--border) shrink-0  top-0 z-40">
      <div className="w-full px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link
          href={isLoggedIn ? "/tender" : "/"}
          className="flex items-center gap-2 shrink-0 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <IconShoppingBag size={22} className="text-[#9fef00]" />
          <span className="font-bold text-base tracking-tight text-(--text-primary)">
            ProcureHub
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-(--border) shrink-0" />
        <div className="flex-1" />

        {/* Nav links with active highlighting */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              // 3. Check if current link matches the active route
              const isActive =
                pathname === link.href ;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? "text-(--text-primary) font-semibold bg-black/10 dark:bg-white/10"
                      : "text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </button>

              <button className="relative p-2 text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
                <IconBell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-(--border)">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md transition-colors ${
                    pathname === "/profile"
                      ? "bg-black/10 dark:bg-white/10"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium text-(--text-primary) leading-none">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-[10px] text-(--text-faint) capitalize leading-none mt-0.5">
                      {user?.role ?? ""}
                    </p>
                  </div>
                  <IconChevronDown size={12} className="text-(--text-faint)" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-(--border-strong) cursor-pointer text-(--text-muted) hover:bg-red-900/20 hover:border-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggle}
                className="p-2 text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </button>
              <Link
                href="/login"
                className={`text-sm text-(--text-subtle) hover:text-(--text-primary) px-3 py-1.5 rounded-md transition-colors ${
                  pathname === "/login"
                    ? "bg-black/10 dark:bg-white/10 font-semibold text-(--text-primary)"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                Log in
              </Link>
              <Link
                href="/registration"
                className="text-sm font-semibold bg-[#9fef00] hover:bg-[#8cd900] text-[#14120e] px-4 py-1.5 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
