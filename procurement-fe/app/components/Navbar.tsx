"use client";

import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
  { label: "Browse Tenders", hasDropdown: true },
  { label: "Submit Bid", hasDropdown: true },
  { label: "Track Status", hasDropdown: true },
  { label: "Why ProcureHub", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
  { label: "Enterprise", hasDropdown: false },
];

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block ml-0.5"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <div className="w-full font-sans">
      {/* Main nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              ProcureHub
            </span>
          </Link>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href="#"
                  className="flex items-center gap-0.5 text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors"
          >
            Log in
          </a>
          <a
            href="/register"
            className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            Sign up
          </a>
        </div>
      </nav>

      {/* Announcement banner */}
      {bannerVisible && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 mx-6 mt-3 mb-1 px-5 py-3 rounded-lg">
          <p className="text-sm text-gray-800">
            Streamline your procurement process. Access verified vendors and
            transparent tender management.
          </p>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <a
              href="/tenders"
              className="text-sm font-medium text-green-700 hover:text-green-800 flex items-center gap-1 whitespace-nowrap"
            >
              View open tenders
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
            <button
              onClick={() => setBannerVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
