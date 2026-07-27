import React from "react";

function About() {
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
  return (
    <div>
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
    </div>
  );
}

export default About;
