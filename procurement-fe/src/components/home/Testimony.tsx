import React from "react";
import { IconBuildingBank } from "@tabler/icons-react";

const institutions = [
  "Ministry of Finance",
  "City Council",
  "National Health Fund",
  "Transport Authority",
  "Education Board",
  "Energy Commission",
];

export default function Testimony() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-surface)] py-10 px-6">
      <p className="text-center text-[10px] uppercase tracking-widest text-[var(--text-faint)] mb-6">
        Trusted by leading public institutions
      </p>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {institutions.map((name) => (
          <div key={name} className="flex items-center gap-2">
            <IconBuildingBank size={13} className="text-[var(--text-faint)]" />
            <span className="text-sm font-medium text-[var(--text-subtle)]">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
