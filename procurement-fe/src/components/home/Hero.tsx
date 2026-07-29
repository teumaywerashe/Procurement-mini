import React from "react";

function Hero() {
  const categories = [
    { label: "Construction →" },
    { label: "IT Services →" },
    { label: "Consulting →" },
    { label: "Medical Supplies →" },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      {/* Background overlay image effect */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1400&q=80')",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-6">
          Procurement at the speed of trust
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mb-10">
          Connect government agencies and verified vendors on a transparent,
          end-to-end tendering platform built for accountability.
        </p>

        {/* Toggle tabs */}
        <div className="flex gap-0 mb-6 w-fit rounded-full border border-white/30 overflow-hidden">
          <button className="px-6 py-2.5 bg-white text-gray-900 cursor-pointer text-sm font-semibold">
            I want to tender
          </button>
          <button className="px-6 py-2.5 text-white cursor-pointer text-sm font-medium hover:bg-white/10 transition-colors">
            I want to bid
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white rounded-full overflow-hidden max-w-xl shadow-lg">
          <input
            type="text"
            placeholder="Search tenders by keyword or category..."
            className="flex-1 px-5 py-3.5 text-gray-800 text-sm outline-none"
          />
          <button className="flex items-center gap-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-3.5 text-sm font-semibold transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </div>

        {/* Quick category pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {categories.map((c) => (
            <a
              key={c.label}
              href="#"
              className="text-xs border border-white/40 hover:border-white text-white px-4 py-1.5 rounded-full transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
