import {
  CloudSun,
  Bot,
  Wheat,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const cards = [
  {
    title: "Today's Weather",
    value: "29°C",
    subtitle: "Sunny • Humidity 82%",
    trend: "+2°C",
    progress: 72,
    icon: CloudSun,
    color: "from-sky-500 to-cyan-500",
    bg: "bg-sky-50",
  },
  {
    title: "AI Queries",
    value: "126",
    subtitle: "18 New Today",
    trend: "+14%",
    progress: 85,
    icon: Bot,
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Crop Health",
    value: "Healthy",
    subtitle: "No Disease Detected",
    trend: "98%",
    progress: 98,
    icon: Wheat,
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
  },
  {
    title: "Market Trend",
    value: "+8%",
    subtitle: "Rice Prices Rising",
    trend: "+8%",
    progress: 78,
    icon: TrendingUp,
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50",
  },
];

function OverviewCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Top Gradient */}
            <div
              className={`h-2 w-full bg-gradient-to-r ${card.color}`}
            />

            <div className="p-6">
              {/* Header */}

              <div className="flex items-center justify-between">
                <div
                  className={`rounded-2xl ${card.bg} p-4 shadow-sm`}
                >
                  <div
                    className={`rounded-xl bg-gradient-to-r ${card.color} p-3 text-white`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <ArrowUpRight size={14} />
                  {card.trend}
                </div>
              </div>

              {/* Title */}

              <div className="mt-6">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              {/* Progress */}

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Status</span>
                  <span>{card.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                    style={{
                      width: `${card.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}

              <div className="mt-6 flex items-center justify-between border-t pt-4">

                <span className="text-xs text-slate-400">
                  Updated Just Now
                </span>

                <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium transition hover:bg-slate-200">
                  Details
                </button>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OverviewCards;