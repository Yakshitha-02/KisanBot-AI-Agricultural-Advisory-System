import React, { useState } from "react";
import { CloudSun, Sun, CloudRain, Droplets, Wind, Thermometer, ShieldAlert, CheckCircle, Info } from "lucide-react";

export default function Weather() {
  const [selectedDay, setSelectedDay] = useState(0);

  const forecast = [
    { day: "Today", temp: "31°C / 24°C", icon: "cloudsun", status: "Partly Cloudy", rainProb: "10%", humidity: "58%", wind: "12 km/h", sprayVerdict: "Safe", sprayAdvisory: "Excellent conditions for neem seed kernel spray. Low wind prevents chemical drift.", irrigationNeed: "Low", irrigationAdvisory: "Previous rains left high soil moisture. Maintain AWD (alternate wet-dry) state for Basmati crops." },
    { day: "Friday", temp: "30°C / 23°C", icon: "rain", status: "Scattered Showers", rainProb: "70%", humidity: "82%", wind: "18 km/h", sprayVerdict: "Unsafe", sprayAdvisory: "Avoid spraying. Rain will wash away pesticide coating from leaves.", irrigationNeed: "None", irrigationAdvisory: "Rainfall is sufficient to fill paddy rows. Open drainage channels to prevent waterlogging." },
    { day: "Saturday", temp: "29°C / 23°C", icon: "rain", status: "Heavy Rain", rainProb: "90%", humidity: "88%", wind: "22 km/h", sprayVerdict: "Unsafe", sprayAdvisory: "Severe risk of washaway. Keep fertilizers dry in storage.", irrigationNeed: "None", irrigationAdvisory: "No irrigation needed. Ensure adequate field boundaries to trap rain water." },
    { day: "Sunday", temp: "32°C / 24°C", icon: "cloudsun", status: "Mostly Sunny", rainProb: "15%", humidity: "65%", wind: "8 km/h", sprayVerdict: "Safe", sprayAdvisory: "Soil is wet but air is clear. Ideal to apply granular urea to crop roots.", irrigationNeed: "Medium", irrigationAdvisory: "Monitor high-drainage sandy soils. Sowing can resume safely." },
    { day: "Monday", temp: "33°C / 25°C", icon: "sun", status: "Sunny", rainProb: "5%", humidity: "52%", wind: "10 km/h", sprayVerdict: "Safe", sprayAdvisory: "Perfect clear day. Complete foliar spraying by 11:00 AM before noon heat.", irrigationNeed: "High", irrigationAdvisory: "Clay soils starting to crack. Shallow 2 cm water replenishment recommended for rice fields." },
    { day: "Tuesday", temp: "33°C / 25°C", icon: "sun", status: "Sunny", rainProb: "5%", humidity: "50%", wind: "9 km/h", sprayVerdict: "Safe", sprayAdvisory: "Optimal weather for insecticidal spray. No rain forecast for 48 hours.", irrigationNeed: "High", irrigationAdvisory: "Normal irrigation cycle should be kept." },
    { day: "Wednesday", temp: "32°C / 24°C", icon: "cloudsun", status: "Partly Cloudy", rainProb: "20%", humidity: "60%", wind: "14 km/h", sprayVerdict: "Safe", sprayAdvisory: "Fine to spray in morning hours.", irrigationNeed: "Medium", irrigationAdvisory: "Sufficient soil moisture." }
  ];

  const getIconComponent = (icon: string, size = 24) => {
    switch (icon) {
      case "sun": return <Sun size={size} className="text-amber-500 animate-spin-slow" />;
      case "rain": return <CloudRain size={size} className="text-blue-500 animate-bounce-slow" />;
      default: return <CloudSun size={size} className="text-amber-600" />;
    }
  };

  const current = forecast[selectedDay];

  return (
    <div id="weather-view" className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Agricultural Weather Advisory</h2>
        <p className="text-xs text-gray-500">Real-time local climate telemetry synced with spraying and irrigation windows.</p>
      </div>

      {/* Main Grid: Current Day Weather & Agricultural Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Day Weather metrics */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">{current.day === "Today" ? "Current Conditions" : `${current.day}'s Forecast`}</span>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{current.temp.split(" / ")[0]}</h3>
              <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                {getIconComponent(current.icon, 16)}
                {current.status}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              {getIconComponent(current.icon, 36)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Droplets size={10} className="text-blue-500" /> Rain Prob.
              </span>
              <p className="text-sm font-bold text-gray-800">{current.rainProb}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Droplets size={10} className="text-emerald-500" /> Humidity
              </span>
              <p className="text-sm font-bold text-gray-800">{current.humidity}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Wind size={10} className="text-teal-500" /> Wind speed
              </span>
              <p className="text-sm font-bold text-gray-800">{current.wind}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Thermometer size={10} className="text-red-500" /> Min Temp
              </span>
              <p className="text-sm font-bold text-gray-800">{current.temp.split(" / ")[1]}</p>
            </div>
          </div>
        </div>

        {/* Agricultural Actions & Advisories */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Spraying Advisory Card */}
          <div className={`border rounded-2xl p-6 shadow-3xs flex flex-col justify-between ${
            current.sprayVerdict === "Safe" 
              ? "bg-emerald-50/50 border-emerald-100 text-emerald-950" 
              : "bg-red-50/50 border-red-100 text-red-950"
          }`}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Pesticide & Spray Window</h4>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  current.sprayVerdict === "Safe" 
                    ? "bg-emerald-200 text-emerald-900" 
                    : "bg-red-200 text-red-900"
                }`}>
                  {current.sprayVerdict === "Safe" ? "✓ Recommended" : "✗ Avoid Spraying"}
                </span>
              </div>
              
              <div className="flex gap-3">
                <div className={`p-2.5 rounded-xl ${current.sprayVerdict === "Safe" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {current.sprayVerdict === "Safe" ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900">Verdict: {current.sprayVerdict}</h5>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {current.sprayAdvisory}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100/30 text-[10px] text-gray-400 flex items-center gap-1.5">
              <Info size={12} />
              <span>Checked against local humidity and wind drift formulas.</span>
            </div>
          </div>

          {/* Irrigation advisory card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Water Management</h4>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  current.irrigationNeed === "High" 
                    ? "bg-amber-100 text-amber-800" 
                    : current.irrigationNeed === "Medium"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  Water Need: {current.irrigationNeed}
                </span>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Droplets size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900">Irrigation Advice</h5>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {current.irrigationAdvisory}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100/30 text-[10px] text-gray-400 flex items-center gap-1.5">
              <Info size={12} />
              <span>Based on crop transpiration rate coefficients.</span>
            </div>
          </div>

        </div>

      </div>

      {/* 7-Day Horizontal Swipeable cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">7-Day Sowing Outlook</h3>
        <div id="forecast-row" className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {forecast.map((day, idx) => (
            <button
              key={idx}
              id={`forecast-card-${idx}`}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 w-28 p-3 rounded-xl border text-center transition ${
                selectedDay === idx 
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                  : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className={`text-xs block font-bold ${selectedDay === idx ? "text-emerald-100" : "text-gray-400"}`}>{day.day}</span>
              <div className="my-2 flex justify-center">
                {getIconComponent(day.icon, 20)}
              </div>
              <span className="text-xs font-bold block">{day.temp.split(" / ")[0]}</span>
              <span className={`text-[10px] block mt-1 font-semibold ${
                day.sprayVerdict === "Safe" 
                  ? selectedDay === idx ? "text-emerald-200" : "text-emerald-600"
                  : selectedDay === idx ? "text-red-200" : "text-red-500"
              }`}>
                Spray: {day.sprayVerdict}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
