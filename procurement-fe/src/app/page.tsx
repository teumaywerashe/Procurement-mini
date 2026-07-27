import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Testimony from "../components/home/Testimony";
import About from "../components/home/About";

const stats = [
  { value: "2,400+", label: "Active tenders" },
  { value: "18,000+", label: "Registered vendors" },
  { value: "$4.2B+", label: "Contract value managed" },
  { value: "98%", label: "Award transparency rate" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Trusted by strip */}
      <Testimony />

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
      <About />

      {/* CTA */}
      <Footer />
    </div>
  );
}
