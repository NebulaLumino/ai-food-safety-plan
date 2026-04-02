'use client';

import { useState } from 'react';

export default function FoodSafetyPage() {
  const [form, setForm] = useState({
    cuisineType: '',
    foodHandlingRisks: '',
    kitchenSetup: '',
    storageCapacity: '',
    localHealthCodes: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/##\s+(.*)/g, '<h2 class="text-orange-400 font-bold text-base mt-5 mb-2 uppercase tracking-wide">$1</h2>')
      .replace(/###\s+(.*)/g, '<h3 class="text-white font-semibold text-sm mt-3 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\[ \]/g, '☐')
      .replace(/\n\n/g, '</p><p class="text-gray-300 my-3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="border-b border-orange-500/20 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl">🛡️</div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Food Safety & HACCP Plan Generator</h1>
            <p className="text-xs text-gray-400">Critical control points, temperature logs & compliance</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 border border-orange-500/20 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Kitchen Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Cuisine Type</label>
                  <select name="cuisineType" value={form.cuisineType} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none transition">
                    <option value="">Select cuisine...</option>
                    <option value="Japanese / Sushi">Japanese / Sushi</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Thai">Thai</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                    <option value="French">French</option>
                    <option value="Mexican">Mexican</option>
                    <option value="American / Grill">American / Grill</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Korean">Korean</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Spanish / Tapas">Spanish / Tapas</option>
                    <option value="Bakery / Pastry">Bakery / Pastry</option>
                    <option value="Food Truck (Mixed)">Food Truck (Mixed)</option>
                    <option value="Catering (Multi-Cuisine)">Catering (Multi-Cuisine)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Food Handling Risk Level</label>
                  <select name="foodHandlingRisks" value={form.foodHandlingRisks} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none transition">
                    <option value="">Select risk level...</option>
                    <option value="Low Risk (pre-packaged, minimal prep)">Low Risk (pre-packaged, minimal prep)</option>
                    <option value="Medium Risk (cooked from raw, some TCS)">Medium Risk (cooked from raw, some TCS)</option>
                    <option value="High Risk (raw proteins, sushi, TCS foods)">High Risk (raw proteins, sushi, TCS foods)</option>
                    <option value="Very High Risk (raw meats + fish + dairy)">Very High Risk (raw meats + fish + dairy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Kitchen Setup</label>
                  <select name="kitchenSetup" value={form.kitchenSetup} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none transition">
                    <option value="">Select setup...</option>
                    <option value="Commercial kitchen (full brigade)">Commercial kitchen (full brigade)</option>
                    <option value="Commercial kitchen (small/limited)">Commercial kitchen (small/limited)</option>
                    <option value="Ghost kitchen / delivery only">Ghost kitchen / delivery only</option>
                    <option value="Food truck / mobile">Food truck / mobile</option>
                    <option value="Restaurant (open kitchen)">Restaurant (open kitchen)</option>
                    <option value="Catering prep kitchen">Catering prep kitchen</option>
                    <option value="Bakery / pastry kitchen">Bakery / pastry kitchen</option>
                    <option value="Home kitchen (cottage food)">Home kitchen (cottage food)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Storage Capacity</label>
                  <select name="storageCapacity" value={form.storageCapacity} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none transition">
                    <option value="">Select storage...</option>
                    <option value="Walk-in cooler + walk-in freezer">Walk-in cooler + walk-in freezer</option>
                    <option value="Walk-in cooler only">Walk-in cooler only</option>
                    <option value="Reach-in coolers (multiple)">Reach-in coolers (multiple)</option>
                    <option value="Limited reach-in coolers">Limited reach-in coolers</option>
                    <option value="Shared cold storage">Shared cold storage</option>
                    <option value="No cold storage (daily pickup)">No cold storage (daily pickup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Local Health Code Standard</label>
                  <select name="localHealthCodes" value={form.localHealthCodes} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none transition">
                    <option value="FDA Food Code (Generic)">FDA Food Code (Generic)</option>
                    <option value="California Retail Food Code">California Retail Food Code</option>
                    <option value="New York City Health Code">New York City Health Code</option>
                    <option value="Texas Food Establishment Rules">Texas Food Establishment Rules</option>
                    <option value="Florida Food Safety Rules">Florida Food Safety Rules</option>
                    <option value="Illinois Food Code">Illinois Food Code</option>
                    <option value="Washington State Food Code">Washington State Food Code</option>
                    <option value="Other / International">Other / International</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg> Generating HACCP Plan...</>
                  ) : (
                    <>🛡️ Generate Food Safety Plan</>
                  )}
                </button>
              </form>
              {error && <p className="mt-3 text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            </div>
          </div>

          <div className="lg:col-span-3">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-orange-500/20 rounded-2xl bg-gray-900/30">
                <div className="text-5xl mb-4">🦠</div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">HACCP Plan Will Appear Here</h3>
                <p className="text-sm text-gray-500 max-w-xs">Enter your kitchen details to generate a complete food safety and HACCP compliance plan.</p>
              </div>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-orange-600/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-orange-400 text-sm font-medium">Building your HACCP plan...</p>
                <p className="text-gray-500 text-xs mt-1">Identifying CCPs, temperature logs, compliance tips</p>
              </div>
            )}
            {result && (
              <div className="bg-gray-900/60 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-orange-400">🛡️ HACCP & Food Safety Plan</h3>
                  <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-gray-400 hover:text-white transition">📋 Copy</button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 overflow-auto max-h-[80vh]" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
