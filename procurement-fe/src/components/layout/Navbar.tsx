"use client";

import Link from "next/link";
import React from "react";
import {
  IconBell,
  IconSettings,
  IconChevronDown,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/src/store/api/userApi";
import { logOut } from "@/src/store/auth/authSlice";
import type { RootState } from "@/src/store/store";


export default function Navbar() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();

  // Avoid SSR/client mismatch — auth state only exists on the client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const authed = mounted && isLoggedIn;

  async function handleLogout() {
    await logoutApi();
    dispatch(logOut());
    router.push("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav className="w-full mx-auto  bg-[#14120e] text-white px-6 py-0 flex flex-center items-center gap-4 h-14 shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
        <IconShoppingBag size={26} className="text-[#9fef00]" />
        <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
          ProcureHub
        </span>
      </Link>

      {/* Nav links */}
      {/* <ul className="hidden lg:flex items-center gap-0 shrink-0">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href="#"
              className="flex items-center gap-0.5 text-sm text-gray-300 hover:text-white px-3 py-4 transition-colors whitespace-nowrap"
            >
              {link.label}
              {link.hasDropdown && (
                <IconChevronDown size={14} className="ml-0.5 mt-0.5" />
              )}
            </a>
          </li>
        ))}
      </ul> */}

      {/* Search */}
      {/* <div className="flex-1 max-w-sm mx-2">
        <div className="flex items-center bg-[#2a2620] border border-[#3a3630] rounded-full px-3 py-1.5 gap-2">
          <IconSearch size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search tenders..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
          />
        </div>
      </div> */}

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {authed ? (
          <>
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <IconBell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <IconSettings size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <IconChevronDown
                size={14}
                className="text-gray-400 group-hover:text-white transition-colors"
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-white border border-[#3a3630] hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white px-3 py-1.5 transition-colors"
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
    </nav>
  );
}
