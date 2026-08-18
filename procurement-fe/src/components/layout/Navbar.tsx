"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconBell,
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
import { Button } from "@mantine/core";

import { clearAuthCookie } from "@/src/utilis/cookie";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/src/store/api/notificationApi";

export default function Navbar() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "Admin";
  const isVendor = user?.role === "Vendor";
  const isSuperAdmin = user?.role === "SuperAdmin";
  const route = useRouter();

  const navLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenders", href: "/tenders" },
        ...(isSuperAdmin ? [{ label: "Vendors", href: "/vendors" }] : []),
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
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetMyNotificationsQuery(undefined, {
      skip: !isLoggedIn,
      pollingInterval: 15000,
      refetchOnFocus: true,
    });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  async function handleLogout() {
    await logoutApi();
    clearAuthCookie();
    dispatch(logOut());
    router.push("/");
    setMenuOpen(false);
    setNotificationsOpen(false);
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
              className="p-2 cursor-pointer text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
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
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((open) => !open)}
                    className="relative p-2 cursor-pointer text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                  >
                    <IconBell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[9px] leading-4 text-center font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <div
                    className={`fixed inset-0 top-14 z-40 bg-black/40 transition-opacity duration-300 md:top-14 ${
                      notificationsOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                    onClick={() => setNotificationsOpen(false)}
                    aria-hidden="true"
                  />

                  <aside
                    className={`fixed right-0 top-0 z-50 flex h-[calc(100vh-3.5rem)] w-[min(24rem,100vw)] flex-col border-l border-(--border) bg-(--bg-base) shadow-2xl transition-transform duration-300 ease-out ${
                      notificationsOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                    aria-label="Notifications panel"
                  >
                    <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-(--text-primary)">
                          Notifications
                        </p>
                        {unreadCount > 0 && (
                          <p className="mt-0.5 text-[11px] text-(--text-faint)">
                            {unreadCount} unread
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="rounded-md cursor-pointer p-2 text-(--text-subtle) transition-colors hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/5"
                        aria-label="Close notifications"
                      >
                        <IconX size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {notificationsLoading ? (
                        <p className="px-4 py-8 text-center text-xs text-(--text-faint)">
                          Loading notifications...
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-xs text-(--text-faint)">
                          You have no notifications.
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification.id}
                            onClick={() => {
                              if (!notification.isRead) {
                                void markNotificationRead(notification.id);
                              }
                              if (isAdmin || isSuperAdmin)
                                router.push(`/bids/${notification.bidId}`);
                              else if (isVendor)
                                router.push(
                                  `/tenders/${notification.tenderId}`,
                                );
                              else router.push("/bids");
                            }}
                            className={`block w-full border-b border-(--border) px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 ${
                              notification.isRead
                                ? "opacity-70"
                                : "bg-indigo-500/5"
                            }`}
                          >
                            <div className="flex gap-3 cursor-pointer items-start">
                              <span
                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-(--border-strong)" : "bg-indigo-500"}`}
                              />
                              <div className="min-w-0">
                                <p className="text-xs leading-5 text-(--text-primary)">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-[10px] text-(--text-faint)">
                                  {new Date(
                                    notification.createdAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </aside>
                </div>
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
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleLogout}
                    loading={isLoggingOut}
                    className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-(--border-strong) cursor-pointer text-(--text-muted) hover:bg-red-900/20 hover:border-red-600 transition-colors"
                  >
                    Logout
                  </Button>
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
                <Button
                  variant="outline"
                  onClick={() => route.push("/login")}
                  className={`text-sm text-(--text-subtle) hover:text-(--text-primary) px-3 py-1.5 rounded-md transition-colors ${
                    pathname === "/login"
                      ? "bg-black/10 dark:bg-white/10 font-semibold text-(--text-primary)"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  Log in
                </Button>
                <Button
                  variant="filled"
                  onClick={() => route.push("/registration")}
                  className="text-sm font-semibold bg-[#9fef00] hover:bg-[#8cd900] text-[#14120e] px-4 py-1.5 rounded-full transition-colors"
                >
                  Sign up
                </Button>
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
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors"
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
