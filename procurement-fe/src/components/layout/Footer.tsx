import React from "react";

function Footer() {
  return (
    <div>
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
            href="/registration"
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

export default Footer;
