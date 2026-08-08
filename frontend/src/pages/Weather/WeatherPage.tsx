import { useEffect, useState } from "react";
import { weatherService } from "../../services/weather";

interface Weather {
  city: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  description: string;
}

interface Forecast {
  datetime: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const current = await weatherService.getCurrentByLocation(
            latitude,
            longitude
          );

          const forecastRes = await weatherService.getForecast(
            latitude,
            longitude
          );

          setWeather(current.data);
          setForecast(forecastRes.data);
        } catch (err) {
          console.error(err);
          setError("Unable to load weather right now.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to access your location.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const searchCity = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const current = await weatherService.getCurrent(city);

      setWeather(current.data);

      // forecast using city
      const geo = await weatherService.getCoordinates(city);

      const forecastRes = await weatherService.getForecast(
        geo.data.lat,
        geo.data.lon
      );

      setForecast(forecastRes.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load weather right now.");
    } finally {
      setLoading(false);
    }
  };

  const dailyForecast = forecast.filter((_, index) => index % 8 === 0);

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        🌦 Weather Forecast
      </h1>

      {/* Search */}

      <div className="flex gap-3 mb-8">

        <input
          className="flex-1 border rounded-xl px-5 py-3"
          placeholder="Search any city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={searchCity}
          className="bg-green-600 text-white px-6 rounded-xl"
        >
          Search
        </button>

        <button
          onClick={loadCurrentLocation}
          className="border px-6 rounded-xl"
        >
          📍 My Location
        </button>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600">
          Loading weather data...
        </div>
      )}

      {/* Current Weather */}

      {weather && (
        <div className="bg-gradient-to-r from-green-700 to-lime-500 text-white rounded-3xl p-8 shadow-xl mb-10">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-3xl font-bold">
                📍 {weather.city}
              </h2>

              <p className="capitalize text-lg mt-2">
                {weather.description}
              </p>

              <div className="text-7xl font-bold mt-4">
                {Math.round(weather.temperature)}°C
              </div>

            </div>

            <div className="text-right space-y-3">

              <div>
                💧 Humidity
                <br />
                <span className="text-2xl font-semibold">
                  {weather.humidity}%
                </span>
              </div>

              <div>
                🌬 Wind
                <br />
                <span className="text-2xl font-semibold">
                  {weather.wind_speed} m/s
                </span>
              </div>

            </div>

          </div>

        </div>
      )}

      <h2 className="text-2xl font-bold mb-5">
        🌤 5-Day Forecast
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

        {dailyForecast.map((item) => (

          <div
            key={item.datetime}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >

            <h3 className="font-semibold">

              {new Date(item.datetime).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}

            </h3>

            <img
              className="mx-auto w-24 h-24"
              src={`https://openweathermap.org/img/wn/${item.icon}@4x.png`}
              alt=""
            />

            <div className="text-5xl font-bold text-green-700">
              {Math.round(item.temperature)}°
            </div>

            <div className="font-semibold mt-3">
              {item.condition}
            </div>

            <div className="text-gray-500 capitalize text-sm">
              {item.description}
            </div>

          </div>

        ))}

      </div>

      <div className="mt-12 bg-green-50 rounded-2xl p-6 border">

        <h2 className="text-2xl font-bold mb-3">
          🌾 Farming Advisory
        </h2>

        <ul className="space-y-2">

          <li>✅ Check today's weather before irrigation.</li>

          <li>✅ Avoid pesticide spraying if rain is expected.</li>

          <li>✅ Monitor humidity to prevent fungal diseases.</li>

          <li>✅ Plan harvesting during dry weather.</li>

        </ul>

      </div>

    </div>
  );
}