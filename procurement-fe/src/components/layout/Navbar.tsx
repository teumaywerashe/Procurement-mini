"use client";

import Link from "next/link";
import {
  IconBell,
  IconChevronDown,
  IconShoppingBag,
  IconSearch,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/src/store/api/userApi";
import { logOut } from "@/src/store/auth/authSlice";
import type { RootState } from "@/src/store/store";
import { useTheme } from "@/src/components/ThemeProvider";

export default function Navbar() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";
  const dispatch = useDispatch();
  const router = useRouter();
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
    <header className="w-full bg-[#0f0e0b] border-b border-[#2a2620] shrink-0 sticky top-0 z-40">
      <div className="w-full px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link
          href={isLoggedIn ? "/tender" : "/"}
          className="flex items-center gap-2 shrink-0"
        >
          <IconShoppingBag size={22} className="text-[#9fef00]" />
          <span className="font-bold text-base tracking-tight text-white">
            ProcureHub
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-[#2a2620] shrink-0" />

        {/* Nav links */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Global search */}
        {isLoggedIn && (
          <div className="hidden lg:flex flex-1 max-w-sm items-center bg-[#1c1a16] border border-[#2a2620] rounded-lg px-3 py-1.5 gap-2 ml-2">
            <IconSearch size={14} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search tenders..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
            />
          </div>
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
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
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

              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                <IconBell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#2a2620]">
                <div className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md hover:bg-white/5 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium text-white leading-none">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize leading-none mt-0.5">
                      {user?.role ?? ""}
                    </p>
                  </div>
                  <IconChevronDown size={12} className="text-gray-500" />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-600 cursor-pointer text-white-400 hover:bg-red-900/20 hover:border-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggle}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
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
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
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
