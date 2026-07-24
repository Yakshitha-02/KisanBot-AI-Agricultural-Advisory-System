import {
  CloudRain,
  Leaf,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

function CropAdviceCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            🌱 Today's AI Recommendations
          </h2>

          <p className="mt-2 text-slate-500">
            Personalized recommendations based on weather, crop condition and market trends.
          </p>

        </div>

        <div className="rounded-2xl bg-emerald-100 p-4">
          <Leaf className="text-emerald-700" size={32} />
        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <div className="flex gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <CloudRain className="text-blue-600" />

          <div>

            <h3 className="font-semibold">
              Irrigation
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Light irrigation is recommended today due to high temperatures.
            </p>

          </div>

        </div>

        <div className="flex gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <TrendingUp className="text-orange-500" />

          <div>

            <h3 className="font-semibold">
              Market Alert
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Tomato prices increased by 8%. Consider selling this week.
            </p>

          </div>

        </div>

        <div className="flex gap-4 rounded-2xl border border-green-100 bg-green-50 p-5">

          <ShieldCheck className="text-green-600" />

          <div>

            <h3 className="font-semibold">
              Disease Risk
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Disease probability is currently low. Continue weekly inspection.
            </p>

          </div>

        </div>

        <div className="flex gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5">

          <Leaf className="text-purple-600" />

          <div>

            <h3 className="font-semibold">
              Fertilizer Advice
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Apply balanced NPK fertilizer within the next 3 days.
            </p>

          </div>

        </div>

      </div>

      <button className="mt-8 flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700">

        View Full AI Report

        <ArrowRight size={18} />

      </button>

    </div>
  );
}

export default CropAdviceCard;