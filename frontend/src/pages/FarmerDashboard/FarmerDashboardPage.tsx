import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { weatherService, WeatherResponse } from "../../services/weather";
import {
  FiBookOpen,
  FiCloudRain,
  FiMessageCircle,
  FiTrendingUp,
  FiArrowRight,
  FiSun,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OverviewCards from "../../components/dashboard/OverviewCards";
import { marketService, MarketPrice } from "../../services/market";
import { chatService, Session } from "../../services/chat";

function FarmerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);

const [loadingWeather, setLoadingWeather] = useState(true);
const [sessions, setSessions] = useState<Session[]>([]);
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const getSubtitle = () => {
  const hour = new Date().getHours();

  if (hour < 12)
    return "Ready to check today's weather and crop conditions?";

  if (hour < 17)
    return "Need help with crop diseases, fertilizers, or market prices?";

  return "How can i help you with your farming needs today?";
};
useEffect(() => {
  const loadDashboard = async () => {
    try {
      // Load market prices
      const marketResponse = await marketService.getDashboardPrices();
      setPrices(marketResponse.data);

      // Load previous chats
      const sessionResponse = await chatService.getSessions();
      setSessions(sessionResponse.data.slice(0, 3));

      setLoadingPrices(false);
    } catch (err) {
      console.error(err);
      setLoadingPrices(false);
    }

    if (!navigator.geolocation) {
      setLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response =
            await weatherService.getCurrentByLocation(
              position.coords.latitude,
              position.coords.longitude
            );

          console.log("Weather Response:", response.data);

          setWeather(response.data);
        } catch (err) {
          console.error("Weather Error:", err);
        } finally {
          setLoadingWeather(false);
        }
      },
      (err) => {
        console.error(err);
        setLoadingWeather(false);
      }
    );
  };

  loadDashboard();
}, []);
  return (
    <div className="space-y-8">

      {/* Hero */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 p-8 text-white shadow-xl"
      >

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

  <div className="max-w-2xl">

    <p className="text-lg font-medium text-emerald-100">
      {getGreeting()},
    </p>

    <h1 className="mt-2 text-4xl font-bold">
      {user?.full_name ?? "Farmer"} 👋
    </h1>

    <p className="mt-4 text-lg text-emerald-100">
      {getSubtitle()}
    </p>

    <div className="mt-8 flex flex-wrap gap-4">

      <button
        onClick={() => navigate("/chat")}
        className="rounded-xl bg-white px-7 py-3 font-semibold text-emerald-700 transition hover:scale-105"
      >
        🤖 Start Chat
      </button>

      <button
        onClick={() => navigate("/knowledge-base")}
        className="rounded-xl border border-white/30 px-7 py-3 backdrop-blur transition hover:bg-white/10"
      >
        📚 Knowledge Library
      </button>

    </div>

  </div>
          <div className="grid grid-cols-2 gap-4">

            <p className="text-sm text-emerald-100">
  {loadingWeather
    ? "Loading..."
    : weather?.city ?? "Weather"}
</p>

<h2 className="text-3xl font-bold">
  {weather
    ? `${Math.round(weather.temperature)}°C`
    : "--"}
</h2>

<p className="mt-2 text-sm text-emerald-100">
  {weather?.condition}
</p>

<p className="text-xs text-emerald-200">
  💧 {weather?.humidity}%
</p>

            <p className="text-sm text-emerald-100">
  {prices.length > 0
    ? prices[0].commodity
    : "Loading..."}
</p>

<h2 className="text-2xl font-bold">
  {prices.length > 0
    ? `₹${prices[0].modal_price}`
    : "--"}
</h2>

          </div>

        </div>

      </motion.div>

      {/* Quick Actions */}

      <div>

        <h2 className="mb-5 text-2xl font-bold">
          ⚡ Quick Actions
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Ask AI */}

          <button
            onClick={() => navigate("/chat")}
            className="rounded-3xl border bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >

            <FiMessageCircle className="mb-4 text-5xl text-emerald-600" />

            <h3 className="text-lg font-semibold">
              Ask AI
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Chat with KisanBot for instant agricultural guidance.
            </p>

          </button>

          {/* Knowledge */}

          <button
            onClick={() => navigate("/knowledge-base")}
            className="rounded-3xl border bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >

            <FiBookOpen className="mb-4 text-5xl text-blue-600" />

            <h3 className="text-lg font-semibold">
              Knowledge Library
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Browse trusted farming documents.
            </p>

          </button>

          {/* Weather */}

          <button
            onClick={() => navigate("/weather")}
            className="rounded-3xl border bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >

            <FiCloudRain className="mb-4 text-5xl text-cyan-600" />

            <h3 className="text-lg font-semibold">
              Weather
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              View today's weather forecast.
            </p>

          </button>

          {/* Market */}

          <button
            onClick={() => navigate("/market")}
            className="rounded-3xl border bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >

            <FiTrendingUp className="mb-4 text-5xl text-orange-500" />

            <h3 className="text-lg font-semibold">
              Market Prices
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Check today's mandi prices.
            </p>

          </button>

        </div>

      </div>

            {/* Bottom Section */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Continue Chat */}

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-3xl border bg-white p-6 shadow lg:col-span-2"
        >

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              💬 Continue Previous Chat
            </h2>


          </div>

          <div className="space-y-4">

{sessions.length === 0 ? (

<div className="rounded-2xl border p-6 text-center text-slate-500">

No previous conversations.

</div>

) : (

sessions.map((session) => (

<div
key={session.id}
className="flex items-center justify-between rounded-2xl border p-5 transition hover:bg-slate-50"
>

<div>

<h3 className="font-semibold">

💬 {session.title}

</h3>

<p className="mt-1 text-sm text-slate-500">

Created

{" "}

{new Date(
session.created_at ?? ""
).toLocaleDateString()}

</p>

</div>

<button

onClick={() =>
navigate(
`/chat?session=${session.id}`
)
}

className="rounded-xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
>

Continue

</button>

</div>

))

)}

</div>

        </motion.div>

        {/* Weather */}


      </div>

      {/* Latest Knowledge & Market */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Knowledge */}

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-3xl border bg-white p-6 shadow"
        >

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold">

              📚 Latest Knowledge

            </h2>

            <button
              onClick={() => navigate("/knowledge-base")}
              className="text-emerald-600 hover:text-emerald-700"
            >
              View All →
            </button>

          </div>

          <div className="space-y-4">

            <div className="rounded-xl bg-slate-50 p-4">

              📄 Tomato Diseases Guide

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              📄 Rice Cultivation Handbook

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              📄 Government Agriculture Schemes

            </div>

          </div>

        </motion.div>

        {/* Market */}

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-3xl border bg-white p-6 shadow"
        >

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold">

              📈 Market Summary

            </h2>

          </div>

          <div className="space-y-5">

            <div className="space-y-4">

  {prices.map((item) => (

    <div
      key={item.commodity}
      className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
    >

      <span>
        🌾 {item.commodity}
      </span>

      <span className="font-semibold text-green-600">
        ₹{item.modal_price}
      </span>

    </div>

  ))}

</div>

           

            

          </div>

        </motion.div>

      </div>

    </div>
  );
}

export default FarmerDashboardPage;