import { useEffect, useMemo, useState } from "react";
import { BarChart3, Search, TrendingUp, Calendar } from "lucide-react";
import { marketService } from "../../services/market";

const commodities = [
  "Tomato",
  "Rice",
  "Onion",
  "Potato",
  "Maize",
  "Cotton",
];

const states = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
];

export default function MarketPage() {
  const [commodity, setCommodity] = useState("Tomato");
  const [state, setState] = useState("Andhra Pradesh");
  const [search, setSearch] = useState("");

  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadData(c: string, s: string) {
    try {
      setLoading(true);

      const res = await marketService.getPrice(c, s);

      setMarket(res.data);
    } catch {
      setMarket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(commodity, state);
  }, [commodity, state]);

  const filteredCommodities = useMemo(() => {
    return commodities.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-lime-500 text-white p-8 shadow-lg">

        <div className="flex items-center gap-3">

          <BarChart3 size={38} />

          <div>
            <h1 className="text-4xl font-bold">
              Live Market Prices
            </h1>

            <p className="text-green-100 mt-2">
              Real-time AGMARKNET mandi prices across India
            </p>

            <div className="flex gap-8 mt-4 text-sm">

              <span>📍 {state}</span>

              <span>
                <Calendar size={15} className="inline mr-1" />
                Updated Today
              </span>

            </div>
          </div>

        </div>

      </div>

      {/* Search */}

      <div className="mt-8 bg-white rounded-xl shadow p-5">

        <div className="grid md:grid-cols-3 gap-4">

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              placeholder="Search commodity..."
              className="w-full border rounded-lg pl-10 p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border rounded-lg p-2"
          >
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Commodity Cards */}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">

        {filteredCommodities.map((item) => (

          <button
            key={item}
            onClick={() => setCommodity(item)}
            className={`rounded-xl p-5 transition shadow

            ${
              commodity === item
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-green-50"
            }`}
          >
            <div className="text-3xl mb-2">

              {item === "Tomato" && "🍅"}
              {item === "Rice" && "🌾"}
              {item === "Onion" && "🧅"}
              {item === "Potato" && "🥔"}
              {item === "Maize" && "🌽"}
              {item === "Cotton" && "🧶"}

            </div>

            <div className="font-semibold">
              {item}
            </div>

          </button>

        ))}

      </div>

      {/* Statistics */}

      {market && (

        <div className="grid md:grid-cols-4 gap-5 mt-8">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Commodity</p>
            <h2 className="text-2xl font-bold">
              {market.commodity}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Modal Price</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{market.modal_price}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Market</p>
            <h2 className="text-xl font-semibold">
              {market.market}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">District</p>
            <h2 className="text-xl font-semibold">
              {market.district}
            </h2>
          </div>

        </div>

      )}

      {/* Table */}

      <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-2xl font-bold">
            Today's Market Prices
          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : market ? (

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">Commodity</th>

                <th className="text-left p-4">Market</th>

                <th className="text-left p-4">District</th>

                <th className="text-left p-4">Modal</th>

                <th className="text-left p-4">Minimum</th>

                <th className="text-left p-4">Maximum</th>

                <th className="text-left p-4">Arrival</th>

              </tr>

            </thead>

            <tbody>

              <tr className="hover:bg-green-50">

                <td className="p-4 font-semibold">
                  {market.commodity}
                </td>

                <td className="p-4">
                  {market.market}
                </td>

                <td className="p-4">
                  {market.district}
                </td>

                <td className="p-4 font-bold text-green-600">
                  ₹{market.modal_price}
                </td>

                <td className="p-4">
                  ₹{market.min_price}
                </td>

                <td className="p-4">
                  ₹{market.max_price}
                </td>

                <td className="p-4">
                  {market.arrival_date}
                </td>

              </tr>

            </tbody>

          </table>

        ) : (

          <div className="p-10 text-center text-gray-500">
            No market data available.
          </div>

        )}

      </div>

      {/* AI Insight */}

      {market && (

        <div className="bg-blue-50 border border-blue-200 rounded-xl mt-8 p-6">

          <div className="flex gap-3">

            <TrendingUp className="text-blue-600 mt-1" />

            <div>

              <h2 className="font-bold text-xl mb-2">
                AI Market Insight
              </h2>

              <p className="text-gray-700 leading-7">

                <strong>{market.commodity}</strong> is currently trading at a
                modal price of{" "}
                <strong>₹{market.modal_price}</strong> in{" "}
                <strong>{market.market}</strong>,{" "}
                {market.district} district.

                <br />

                The minimum price today is{" "}
                <strong>₹{market.min_price}</strong> while the highest recorded
                price is{" "}
                <strong>₹{market.max_price}</strong>.

                <br />

                Farmers should compare transportation costs and nearby mandis
                before selling to maximize profit.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}