/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/src/types";
import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface MenuListProps {
  setMenuOpen: (menulist: boolean) => void;
  navLinks: Array<any>;
  pathname: string;
  user: User | null;
  initials: string;
  handleLogout: () => void;
}

function MenuList({
  setMenuOpen,
  navLinks,
  pathname,
  user,
  initials,
  handleLogout,
}: MenuListProps) {
  return (
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
  );
}

export default MenuList;
