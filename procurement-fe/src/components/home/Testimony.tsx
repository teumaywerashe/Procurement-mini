import React from "react";

function Testimony() {
  const trustedBy = [
    "Ministry of Finance",
    "City Council",
    "National Health Fund",
    "Transport Authority",
    "Education Board",
    "Energy Commission",
  ];
  return (
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
  );
}

export default Testimony;
