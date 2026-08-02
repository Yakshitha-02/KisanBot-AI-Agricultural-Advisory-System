import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FiArrowRight,
  FiPlayCircle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  CloudSun,
  TrendingUp,
  Bot,
  Languages,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleTryKisanBot = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/farmer/dashboard");
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden py-24"
    >
      {/* Background */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-lime-200/30 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-green-100/40 blur-3xl" />

      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 shadow-sm">

            <Bot
              size={18}
              className="text-emerald-600"
            />

            <span className="text-sm font-semibold text-emerald-700">
              AI Powered Agricultural Assistant
            </span>

          </div>

          {/* Heading */}

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">

            Smarter Farming

            <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 bg-clip-text text-transparent">

              Starts With AI

            </span>

          </h1>

          {/* Description */}

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

            KisanBot helps farmers make better decisions using
            Artificial Intelligence, multilingual support,
            weather forecasting, market price prediction,
            crop disease assistance and government schemes —
            all in one intelligent platform.

          </p>

          {/* CTA */}

<div className="mt-10 flex flex-wrap gap-5">

  <button
    onClick={handleTryKisanBot}
    className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 font-semibold text-white shadow-xl transition hover:scale-105 hover:bg-emerald-700"
  >
    Try KisanBot
    <FiArrowRight />
  </button>

  <button className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600">
    <FiPlayCircle />
    Watch Demo
  </button>

</div>

          {/* Technology Pills */}

          <div className="mt-10 flex flex-wrap gap-3">

            {[
              "React",
              "FastAPI",
              "LangChain",
              "Pinecone",
              "Sarvam AI",
              "SQLite",
            ].map((tech) => (

              <span
                key={tech}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow"
              >
                {tech}
              </span>

            ))}

          </div>

          {/* Statistics */}

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">

            {[
              {
                value: "120K+",
                label: "Farmers",
              },
              {
                value: "98%",
                label: "Accuracy",
              },
              {
                value: "6+",
                label: "Languages",
              },
              {
                value: "24/7",
                label: "Available",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="rounded-3xl bg-white p-6 text-center shadow-lg"
              >

                <h2 className="text-3xl font-bold text-emerald-700">

                  {item.value}

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                  {item.label}

                </p>

              </div>

            ))}

          </div>

          {/* Feature List */}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">

            {[
              "Weather Forecast",
              "Market Prices",
              "Disease Detection",
              "Voice Assistant",
              "Government Schemes",
              "Multilingual AI",
            ].map((item) => (

              <div
                key={item}
                className="flex items-center gap-3"
              >

                <FiCheckCircle className="text-emerald-600" />

                <span className="text-slate-700">

                  {item}

                </span>

              </div>

            ))}

          </div>

        </motion.div>

        {/* RIGHT SIDE STARTS HERE */}
        {/* RIGHT SIDE */}

<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.9 }}
  className="relative flex justify-center"
>

  {/* Floating Weather Card */}

  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{
      repeat: Infinity,
      duration: 4,
    }}
    className="absolute -left-8 top-10 z-20 rounded-3xl bg-white p-5 shadow-2xl"
  >

    <div className="flex items-center gap-3">

      <CloudSun
        className="text-yellow-500"
        size={28}
      />

      <div>

        <p className="text-sm text-slate-500">

          Weather

        </p>

        <h3 className="font-bold">

          29°C

        </h3>

      </div>

    </div>

    <p className="mt-2 text-xs text-slate-500">

      Humidity 82%

    </p>

  </motion.div>

  {/* Floating Market Card */}

  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{
      repeat: Infinity,
      duration: 5,
    }}
    className="absolute -right-10 top-20 z-20 rounded-3xl bg-white p-5 shadow-2xl"
  >

    <div className="flex items-center gap-3">

      <TrendingUp
        className="text-green-600"
        size={24}
      />

      <div>

        <p className="text-sm text-slate-500">

          Market

        </p>

        <h3 className="font-bold">

          ₹32/kg

        </h3>

      </div>

    </div>

    <p className="mt-2 text-xs text-green-600">

      Tomato ↑ 5%

    </p>

  </motion.div>

  {/* Floating Language Card */}

  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{
      repeat: Infinity,
      duration: 4.5,
    }}
    className="absolute bottom-8 -left-10 z-20 rounded-3xl bg-white p-5 shadow-2xl"
  >

    <div className="flex items-center gap-3">

      <Languages
        className="text-emerald-600"
        size={24}
      />

      <div>

        <h3 className="font-bold">

          6 Languages

        </h3>

        <p className="text-xs text-slate-500">

          Voice Supported

        </p>

      </div>

    </div>

  </motion.div>

  {/* Main Dashboard */}

  <div className="relative w-full max-w-xl rounded-[36px] border border-white/40 bg-white/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">

    {/* Header */}

    <div className="flex items-center justify-between">

      <div>

        <h3 className="text-xl font-bold text-slate-900">

          🤖 AI Dashboard

        </h3>

        <p className="text-sm text-slate-500">

          Real-time Farming Assistant

        </p>

      </div>

      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

        ● Online

      </span>

    </div>

    {/* Chat Window */}

    <div className="mt-8 space-y-5 rounded-3xl bg-slate-50 p-6">

      {/* Farmer */}

      <div className="flex justify-end">

        <div className="max-w-xs rounded-2xl rounded-br-md bg-emerald-600 px-5 py-3 text-white shadow">

          My tomato leaves have yellow spots. What should I do?

        </div>

      </div>

      {/* AI */}

      <div className="flex gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">

          🤖

        </div>

        <div className="max-w-sm rounded-2xl rounded-bl-md bg-white px-5 py-4 shadow">

          <p className="font-semibold text-slate-800">

            Possible Early Blight Detected

          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">

            • Improve air circulation around plants.

            <br />

            • Avoid watering the leaves.

            <br />

            • Apply a recommended fungicide.

            <br />

            • Monitor new leaf growth over the next 5 days.

          </p>

        </div>

      </div>

    </div>

    {/* Bottom Cards */}

    <div className="mt-8 grid grid-cols-3 gap-4">

      <div className="rounded-2xl bg-emerald-50 p-4 text-center">

        <h4 className="text-xl font-bold text-emerald-700">

          98%

        </h4>

        <p className="text-xs text-slate-500">

          Accuracy

        </p>

      </div>

      <div className="rounded-2xl bg-blue-50 p-4 text-center">

        <h4 className="text-xl font-bold text-blue-700">

          24/7

        </h4>

        <p className="text-xs text-slate-500">

          Support

        </p>

      </div>

      <div className="rounded-2xl bg-orange-50 p-4 text-center">

        <h4 className="text-xl font-bold text-orange-600">

          AI

        </h4>

        <p className="text-xs text-slate-500">

          Powered

        </p>

      </div>

    </div>

  </div>

</motion.div>
      </div>
    </section>
  );
}

export default Hero;