import React from "react";
import Link from "next/link";
import { IconShoppingBag, IconArrowRight } from "@tabler/icons-react";

export default function Footer() {
  return (
    <>
      {/* CTA */}
      <section className="bg-[var(--bg-surface)] border-b border-[var(--border)] py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Join the platform
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Ready to simplify procurement?
          </h2>
          <p className="text-sm text-[var(--text-subtle)] mb-8 leading-relaxed">
            Join thousands of agencies and vendors already using ProcureHub to
            run fair, efficient, and auditable procurement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/registration"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Create account <IconArrowRight size={15} />
            </Link>
            <Link
              href="/tenders"
              className="flex items-center gap-2 border border-[var(--border-strong)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-faint)] text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Browse tenders
            </Link>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="bg-[var(--bg-base)] border-t border-[var(--border)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <IconShoppingBag size={16} className="text-[#9fef00]" />
            <span className="text-sm font-bold text-[var(--text-primary)]">
              ProcureHub
            </span>
          </div>
          <p className="text-xs text-[var(--text-faint)]">
            © {new Date().getFullYear()} ProcureHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-[var(--text-faint)] hover:text-[var(--text-subtle)] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/registration"
              className="text-xs text-[var(--text-faint)] hover:text-[var(--text-subtle)] transition-colors"
            >
              Register
            </Link>
            <Link
              href="/tenders"
              className="text-xs text-[var(--text-faint)] hover:text-[var(--text-subtle)] transition-colors"
            >
              Tenders
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
