"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconShoppingBag,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutMutation } from "@/src/store/api/userApi";
import { logOut } from "@/src/store/auth/authSlice";
import type { RootState } from "@/src/store/store";
import { useTheme } from "@/src/components/ThemeProvider";

import { clearAuthCookie } from "@/src/utilis/cookie";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/src/store/api/notificationApi";
import MenuList from "./MenuList";
import NavbarRightSide from "./NavbarRightSide";

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
      <header className="w-full sticky right-0 bg-(--bg-base) border-b border-(--border) z-40">
        <div className="max-w-full mx-auto  sm:px-6 h-14 flex items-center gap-3">
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
          <NavbarRightSide
            toggle={toggle}
            theme={theme}
            isLoggedIn={isLoggedIn}
            setNotificationsOpen={setNotificationsOpen}
            markNotificationRead={markNotificationRead}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            notificationsOpen={notificationsOpen}
            unreadCount={unreadCount}
            pathname={pathname}
            initials={initials}
            user={user}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
          />
        </div>
      </header>

      {isLoggedIn && menuOpen && (
        <MenuList
          setMenuOpen={setMenuOpen}
          navLinks={navLinks}
          pathname={pathname}
          user={user}
          initials={initials}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}
