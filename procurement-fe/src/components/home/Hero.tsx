import React from "react";
import Link from "next/link";
import {
  IconFileText,
  IconGavel,
  IconShieldCheck,
  IconArrowRight,
  IconBuildingSkyscraper,
  IconDeviceDesktop,
  IconTruck,
  IconLeaf,
} from "@tabler/icons-react";

const categories = [
  { label: "Infrastructure", icon: <IconBuildingSkyscraper size={13} /> },
  { label: "Technology",     icon: <IconDeviceDesktop size={13} /> },
  { label: "Logistics",      icon: <IconTruck size={13} /> },
  { label: "Environment",    icon: <IconLeaf size={13} /> },
];

const features = [
  { icon: <IconFileText size={18} className="text-indigo-400" />,    title: "Publish tenders",   desc: "Create and manage procurement notices with structured templates." },
  { icon: <IconGavel size={18} className="text-emerald-400" />,      title: "Submit bids",       desc: "Vendors apply directly through the platform with full audit trails." },
  { icon: <IconShieldCheck size={18} className="text-orange-400" />, title: "Award transparently", desc: "Track evaluations, decisions, and contracts in one place." },
];

export default function Hero() {
  return (
    <section className="bg-(--bg-base) border-b border-(--border)">
      {/* Top hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
         
         
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) leading-tight mb-5">
            Procurement at the<br />
            <span className="text-indigo-400">speed of trust</span>
          </h1>

          <p className="text-base text-(--text-subtle) max-w-xl mb-8 leading-relaxed">
            Connect government agencies and verified vendors on a transparent,
            end-to-end tendering platform built for accountability.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/registration" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
              Get started <IconArrowRight size={15} />
            </Link>
            <Link href="/tenders" className="flex items-center gap-2 border border-(--border-strong) text-(--text-subtle) hover:text-(--text-primary) hover:border-(--text-faint) text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
              Browse tenders
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c.label} href="/tenders"
                className="flex items-center gap-1.5 text-xs text-(--text-subtle) hover:text-(--text-primary) border border-(--border) hover:border-(--border-strong) bg-(--bg-surface) px-3 py-1.5 rounded-full transition-colors">
                {c.icon}{c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="border-t border-(--border)">
        <div className="max-w-6xl  mx-auto px-6 py-10 grid md:grid-cols-3 gap-20 ">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-(--border) border border-(--border) px-8 py-6">
              <div className="w-9 h-9 rounded-lg bg-(--bg-elevated) flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-(--text-primary) mb-1">{f.title}</h3>
              <p className="text-xs text-(--text-subtle) leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
