/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mantine/core";
import {
  IconBell,
  IconChevronDown,
  IconMenu2,
  IconMoon,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import React from "react";
import Notification from "../notifications/Notification";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/src/types";

interface NavbarRightSideProps {
  toggle: () => void;
  theme: string;
  isLoggedIn: boolean;
  setNotificationsOpen: (notificationsOpen: boolean) => void;
  markNotificationRead: (id: number) => void;
  notifications: Array<any>;
  notificationsLoading: boolean;

  notificationsOpen: boolean;
  unreadCount: number;
  pathname: string;
  initials: string;
  user: User | null;
  handleLogout: () => void;
  isLoggingOut: boolean;
  setMenuOpen: (open: any) => void;
  menuOpen: boolean;
}

function NavbarRightSide({
  toggle,
  theme,
  isLoggedIn,
  setNotificationsOpen,
  markNotificationRead,
  notifications,
  notificationsLoading,
  notificationsOpen,
  unreadCount,
  pathname,
  initials,
  user,
  handleLogout,
  isLoggingOut,
  setMenuOpen,
  menuOpen,
}: NavbarRightSideProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
      {/* Theme toggle — always visible */}
      <button
        onClick={toggle}
        className="p-2 cursor-pointer text-(--text-subtle) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
      </button>

      {isLoggedIn ? (
        <>
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open: boolean) => !open)}
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

            <Notification
              notificationsOpen={notificationsOpen}
              unreadCount={unreadCount}
              markNotificationRead={markNotificationRead}
              setNotificationsOpen={setNotificationsOpen}
              notificationsLoading={notificationsLoading}
              notifications={notifications}
            />
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
              <IconChevronDown size={12} className="text-(--text-faint)" />
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
            onClick={() => setMenuOpen((v: boolean) => !v)}
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
            onClick={() => router.push("/login")}
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
            onClick={() => router.push("/registration")}
            className="text-sm font-semibold bg-[#9fef00] hover:bg-[#8cd900] text-[#14120e] px-4 py-1.5 rounded-full transition-colors"
          >
            Sign up
          </Button>
        </>
      )}
    </div>
  );
}

export default NavbarRightSide;
