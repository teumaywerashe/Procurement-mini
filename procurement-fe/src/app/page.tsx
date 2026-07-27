import Navbar from "./components/Navbar";

const categories = [
  { label: "Construction →" },
  { label: "IT Services →" },
  { label: "Consulting →" },
  { label: "Medical Supplies →" },
];

const trustedBy = [
  "Ministry of Finance",
  "City Council",
  "National Health Fund",
  "Transport Authority",
  "Education Board",
  "Energy Commission",
];

const stats = [
  { value: "2,400+", label: "Active tenders" },
  { value: "18,000+", label: "Registered vendors" },
  { value: "$4.2B+", label: "Contract value managed" },
  { value: "98%", label: "Award transparency rate" },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse open tenders",
    desc: "Search across categories, agencies, and deadlines to find relevant procurement opportunities.",
  },
  {
    step: "02",
    title: "Submit your bid",
    desc: "Upload documents, set your price, and track every stage of the evaluation process.",
  },
  {
    step: "03",
    title: "Win & deliver",
    desc: "Get notified of award decisions and manage contract milestones from one dashboard.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
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
            <button className="px-6 py-2.5 bg-white text-gray-900 text-sm font-semibold">
              I want to tender
            </button>
            <button className="px-6 py-2.5 text-white text-sm font-medium hover:bg-white/10 transition-colors">
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
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 text-sm font-semibold transition-colors">
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

      {/* Trusted by strip */}
      <section className="border-y border-gray-100 py-6 px-6">
        <p className="text-center text-xs uppercase tracking-widest text-gray-400 mb-5">
          Trusted by leading public institutions
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
          {trustedBy.map((name) => (
            <span key={name} className="text-sm font-semibold text-gray-400">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            How ProcureHub works
          </h2>
          <p className="text-gray-500 mb-12 max-w-lg">
            From publishing a tender to awarding a contract — everything in one
            place.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                <span className="text-4xl font-black text-green-100 block mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to simplify procurement?
        </h2>
        <p className="text-green-100 mb-8 max-w-md mx-auto">
          Join thousands of agencies and vendors already using ProcureHub to run
          fair, efficient, and auditable procurement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/register"
            className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
          >
            Get started free
          </a>
          <a
            href="/tenders"
            className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            Browse tenders
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ProcureHub. All rights reserved.
      </footer>
    </div>
  );
}
