"use client";

export default function Features() {
  return (
    <section id="features" className="py-16 px-8 text-center">
      <h2 className="text-3xl font-bold mb-10">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-green-400 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">🌍 Realistic Simulations</h3>
          <p>Model how greenhouse gases affect global temperature rise.</p>
        </div>
        <div className="p-6 bg-blue-400 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">📊 Data Insights</h3>
          <p>Get charts & predictions powered by AI-driven analysis.</p>
        </div>
        <div className="p-6 bg-green-400 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">⚡ Interactive Controls</h3>
          <p>Adjust emissions, policies, and energy usage to see outcomes.</p>
        </div>
      </div>
    </section>
  );
}
