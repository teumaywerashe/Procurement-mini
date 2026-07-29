import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Testimony from "../components/home/Testimony";
import About from "../components/home/About";

export default function Home() {
  return (
    <div className="min-h-screen bg-(--bg-base) font-sans">
      <Navbar />
      <Hero />
      <Testimony />

      <About />
      <Footer />
    </div>
  );
}
