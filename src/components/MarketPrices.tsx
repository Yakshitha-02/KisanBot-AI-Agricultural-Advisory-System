import React, { useState } from "react";
import { MANDI_PRICES } from "../kbData";
import { Search, MapPin, TrendingUp, TrendingDown, ArrowRight, Info, Plus } from "lucide-react";

export default function MarketPrices() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCrop, setSelectedCrop] = useState(MANDI_PRICES[0]);

  const uniqueStates = ["All", ...Array.from(new Set(MANDI_PRICES.map((p) => p.state)))];

  const filteredPrices = MANDI_PRICES.filter((p) => {
    const matchesSearch = p.cropName.toLowerCase().includes(search.toLowerCase()) || 
                          p.market.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === "All" || p.state === selectedState;
    return matchesSearch && matchesState;
  });

  const generateMockTrendData = (price: number, trend: string) => {
    // Generate simulated 5-day historical price points for trend line
    const change = trend === "up" ? 15 : trend === "down" ? -15 : 0;
    return [
      price - (change * 4),
      price - (change * 3),
      price - (change * 2),
      price - change,
      price
    ];
  };

  const trendPoints = generateMockTrendData(selectedCrop.price, selectedCrop.trend);
  const maxVal = Math.max(...trendPoints) * 1.05;
  const minVal = Math.min(...trendPoints) * 0.95;
  const range = maxVal - minVal;

  return (
    <div id="market-prices-view" className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Today's Mandi Market Rates</h2>
        <p className="text-xs text-gray-500">Official AGMARKNET agricultural commodity rates across major markets.</p>
      </div>

      {/* Main Grid: Crop Trend Visualization + Mandi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mandi List & Search */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
              <input
                id="mandi-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crop or market..."
                className="w-full bg-gray-50 border border-gray-200 outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-emerald-500"
              />
            </div>

            {/* State filter */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {uniqueStates.map((st) => (
                <button
                  key={st}
                  id={`mandi-state-tab-${st}`}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedState === st 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Crop Name</th>
                  <th className="py-3 px-2">Market & State</th>
                  <th className="py-3 px-2 text-right">Price (₹/Qtl)</th>
                  <th className="py-3 px-2 text-center">Trend</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No mandi prices found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((p, idx) => {
                    const priceDiff = p.price - p.previousPrice;
                    const percentDiff = Math.round((priceDiff / p.previousPrice) * 1000) / 10;
                    
                    return (
                      <tr 
                        key={idx}
                        id={`mandi-row-${idx}`}
                        onClick={() => setSelectedCrop(p)}
                        className={`hover:bg-emerald-50/40 cursor-pointer transition ${
                          selectedCrop.cropName === p.cropName && selectedCrop.market === p.market ? "bg-emerald-50/70" : ""
                        }`}
                      >
                        <td className="py-3.5 px-2 font-bold text-gray-800">{p.cropName}</td>
                        <td className="py-3.5 px-2">
                          <span className="text-gray-700 font-semibold">{p.market}</span>
                          <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-0.5 mt-0.5">
                            <MapPin size={10} /> {p.state}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono font-bold text-gray-800">
                          ₹{p.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          {p.trend === "up" ? (
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                              <TrendingUp size={11} /> +{percentDiff}%
                            </span>
                          ) : p.trend === "down" ? (
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                              <TrendingDown size={11} /> {percentDiff}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                              Stable
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-600" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Selected Crop Trend Visualization Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Trend analysis</span>
            <h3 className="text-lg font-bold text-gray-800 mt-1">{selectedCrop.cropName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{selectedCrop.market} Mandi ({selectedCrop.state})</p>

            {/* Price Highlight */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-gray-900">₹{selectedCrop.price}</span>
              <span className="text-xs text-gray-400">per Quintal (100 Kg)</span>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="pt-6 h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                {/* Gradient Fill under line */}
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                {/* Simulated SVG Path */}
                <path
                  d={`M 0,${30 - ((trendPoints[0] - minVal) / range) * 25} 
                     L 25,${30 - ((trendPoints[1] - minVal) / range) * 25} 
                     L 50,${30 - ((trendPoints[2] - minVal) / range) * 25} 
                     L 75,${30 - ((trendPoints[3] - minVal) / range) * 25} 
                     L 100,${30 - ((trendPoints[4] - minVal) / range) * 25}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                
                <path
                  d={`M 0,${30 - ((trendPoints[0] - minVal) / range) * 25} 
                     L 25,${30 - ((trendPoints[1] - minVal) / range) * 25} 
                     L 50,${30 - ((trendPoints[2] - minVal) / range) * 25} 
                     L 75,${30 - ((trendPoints[3] - minVal) / range) * 25} 
                     L 100,${30 - ((trendPoints[4] - minVal) / range) * 25}
                     L 100,30 L 0,30 Z`}
                  fill="url(#trendGrad)"
                />

                {/* Draw Dots */}
                {trendPoints.map((pt, index) => (
                  <circle
                    key={index}
                    cx={index * 25}
                    cy={30 - ((pt - minVal) / range) * 25}
                    r="1.5"
                    fill="#10b981"
                  />
                ))}
              </svg>
              
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[9px] text-gray-400 font-mono">
                <span>₹{Math.round(maxVal)}</span>
                <span>₹{Math.round(minVal)}</span>
              </div>
            </div>

            <div className="flex justify-between text-[9px] text-gray-400 font-semibold uppercase mt-1">
              <span>5 Days Ago</span>
              <span>3 Days Ago</span>
              <span>Today</span>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-1">
            <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Info size={12} /> Advisory Note
            </h4>
            <p className="text-[11px] text-emerald-950 leading-relaxed">
              {selectedCrop.trend === "up" 
                ? "Prices are moving upwards due to high festive season demand. Excellent time to sell your stock." 
                : selectedCrop.trend === "down"
                ? "Prices cooled down slightly following high supply arrivals. Consider storage options if stock moisture is low."
                : "Prices are stable. Sells can be completed normally at current rates."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
