"use client";
import { useState } from "react";

const ACCENT = "amber";

export default function HACCPPage() {
  const [establishmentType, setEstablishmentType] = useState("Restaurant");
  const [cuisineType, setCuisineType] = useState("American");
  const [foodCategories, setFoodCategories] = useState("");
  const [volume, setVolume] = useState("Medium (50-150 covers/day)");
  const [staffingLevel, setStaffingLevel] = useState("Small (5-15 staff)");
  const [priorViolations, setPriorViolations] = useState("");
  const [certificationLevel, setCertificationLevel] = useState("Basic Food Safety");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ establishmentType, cuisineType, foodCategories, volume, staffingLevel, priorViolations, certificationLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const btnClass = loading
    ? `px-8 py-3 rounded-lg font-semibold text-white bg-${ACCENT}-700 cursor-not-allowed`
    : `px-8 py-3 rounded-lg font-semibold text-white bg-${ACCENT}-600 hover:bg-${ACCENT}-500 transition-all`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r from-${ACCENT}-400 to-${ACCENT}-600 bg-clip-text text-transparent`}>AI Food Safety (HACCP) Plan</h1>
        <p className="text-gray-400 text-sm">Generate comprehensive HACCP food safety plans for food service operations</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Establishment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Establishment Type *</label>
            <select value={establishmentType} onChange={e => setEstablishmentType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200">
              <option>Restaurant</option><option>Cafe</option><option>Catering</option><option>Food Truck</option><option>Hospital</option><option>School Cafeteria</option><option>Hotel/Resort</option><option>Bakery</option><option>Food Manufacturing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Cuisine Type</label>
            <select value={cuisineType} onChange={e => setCuisineType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200">
              <option>American</option><option>Italian</option><option>French</option><option>Japanese</option><option>Mexican</option><option>Indian</option><option>Chinese</option><option>Mediterranean</option><option>Korean</option><option>Thai</option><option>Fusion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Volume</label>
            <select value={volume} onChange={e => setVolume(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200">
              <option>Small (under 50 covers/day)</option><option>Medium (50-150 covers/day)</option><option>Large (150-500 covers/day)</option><option>Very Large (500+ covers/day)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Staffing Level</label>
            <select value={staffingLevel} onChange={e => setStaffingLevel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200">
              <option>Small (5-15 staff)</option><option>Medium (15-50 staff)</option><option>Large (50-100 staff)</option><option>Enterprise (100+ staff)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Certification Level</label>
            <select value={certificationLevel} onChange={e => setCertificationLevel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200">
              <option>Basic Food Safety</option><option>ServSafe Manager</option><option>HACCP Certification</option><option>ISO 22000</option><option>SQF (Safe Quality Food)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Food Categories Handled</label>
            <input value={foodCategories} onChange={e => setFoodCategories(e.target.value)} placeholder="e.g., Raw meats, seafood, dairy, produce" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-300">Prior Violations (if any)</label>
            <textarea value={priorViolations} onChange={e => setPriorViolations(e.target.value)} placeholder="List any prior health code violations or areas of concern" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button onClick={handleGenerate} disabled={loading} className={btnClass}>
          {loading ? "Generating..." : "Generate HACCP Plan"}
        </button>
      </div>
      {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}
      {output && (
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">HACCP Food Safety Plan</h2>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </main>
  );
}
