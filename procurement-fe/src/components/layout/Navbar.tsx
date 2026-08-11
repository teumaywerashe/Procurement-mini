"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconChevronDown,
  IconShoppingBag,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutMutation } from "@/src/store/api/userApi";
import { logOut } from "@/src/store/auth/authSlice";
import type { RootState } from "@/src/store/store";
import { useTheme } from "@/src/components/ThemeProvider";

export default function Navbar() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const isSuperAdmin = user?.role === "SuperAdmin";

  const navLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenders", href: "/tenders" },
        ...(isSuperAdmin
          ? [
              { label: "Vendors", href: "/vendors" },
             
            ]
          : []),
        ...(isVendor ? [{ label: "My Bids", href: "/bids/my" }] : []),
        ...(isAdmin
          ? [
              { label: "Manage", href: "/tenders/manage" },
              { label: "Bids", href: "/bids" },
            ]
          : []),
      ]
    : [];
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [logoutApi] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutApi();
    dispatch(logOut());
    router.push("/");
    setMenuOpen(false);
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
    <>
      <header className="w-full  sticky right-0 bg-(--bg-base) border-b border-(--border) z-40">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center gap-3">
          {/* Logo */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 shrink-0 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <IconShoppingBag size={22} className="text-[#9fef00]" />
            <span className="font-bold text-base tracking-tight text-(--text-primary)">
              ProcureHub
            </span>
          </Link>

          <div className="w-px h-5 bg-(--border) shrink-0" />
          <div className="flex-1" />

          {/* Desktop nav links */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
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

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Theme toggle — always visible */}
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

            {isLoggedIn ? (
              <>
                {/* User avatar — desktop only shows name */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-(--border)">
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition-colors ${
                      pathname === "/profile"
                        ? "bg-black/10 dark:bg-white/10"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {initials}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-medium text-(--text-primary) leading-none">
                        {user?.name ?? "User"}
                      </p>
                      <p className="text-[10px] text-(--text-faint) capitalize leading-none mt-0.5">
                        {user?.role ?? ""}
                      </p>
                    </div>
                    <IconChevronDown
                      size={12}
                      className="text-(--text-faint)"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-(--border-strong) cursor-pointer text-(--text-muted) hover:bg-red-900/20 hover:border-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>

                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="md:hidden p-2 text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
                </button>
              </>
            ) : (
              <>
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

      {isLoggedIn && menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <nav
            className="absolute top-14 left-0 right-0 bg-(--bg-base) border-b border-(--border) shadow-xl px-4 py-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 font-semibold"
                      : "text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="h-px bg-(--border) my-2" />
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-(--text-primary)">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-(--text-faint) capitalize">
                  {user?.role ?? ""}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
