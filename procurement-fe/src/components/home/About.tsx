import React from "react";
import { IconSearch, IconSend, IconTrophy } from "@tabler/icons-react";

const steps = [
  {
    step: "01",
    icon: <IconSearch size={20} className="text-indigo-400" />,
    title: "Browse open tenders",
    desc: "Search across categories, agencies, and deadlines to find relevant procurement opportunities.",
  },
  {
    step: "02",
    icon: <IconSend size={20} className="text-emerald-400" />,
    title: "Submit your bid",
    desc: "Set your price and track every stage of the evaluation process from your dashboard.",
  },
  {
    step: "03",
    icon: <IconTrophy size={20} className="text-orange-400" />,
    title: "Win & deliver",
    desc: "Get notified of award decisions and manage contract milestones from one place.",
  },
];

export default function About() {
  return (
    <section className="bg-[var(--bg-base)] border-b border-[var(--border)] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">How ProcureHub works</h2>
          <p className="text-sm text-[var(--text-subtle)] max-w-lg">
            From publishing a tender to awarding a contract — everything in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((item, i) => (
            <div key={item.step} className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6">
              {/* Step connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-4 h-px bg-[var(--border)] z-10" />
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-[var(--border)] select-none">{item.step}</span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-xs text-[var(--text-subtle)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
