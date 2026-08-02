import { useEffect, useState } from "react";
import {
  adminService,
  UnansweredQuery,
} from "../../services/admin";

function UnansweredQueries() {
  const [queries, setQueries] = useState<UnansweredQuery[]>([]);

  const loadQueries = async () => {
    try {
      const response =
        await adminService.getUnansweredQueries();

      setQueries(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);
  const [search, setSearch] = useState("");

  const resolve = async (id: number) => {
    try {
      await adminService.resolveQuery(id);

      loadQueries();
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-semibold">
        Unanswered Query Logs
      </h2>
      <div className="mb-6 grid grid-cols-3 gap-4">

  <div className="rounded-xl bg-blue-50 p-5">
    <p className="text-slate-500">
      Total Queries
    </p>
    <h2 className="text-3xl font-bold">
      {queries.length}
    </h2>
  </div>

  <div className="rounded-xl bg-yellow-50 p-5">
    <p className="text-slate-500">
      Pending
    </p>
    <h2 className="text-3xl font-bold text-yellow-600">
      {queries.filter(q => !q.resolved).length}
    </h2>
  </div>

  <div className="rounded-xl bg-green-50 p-5">
    <p className="text-slate-500">
      Resolved
    </p>
    <h2 className="text-3xl font-bold text-green-600">
      {queries.filter(q => q.resolved).length}
    </h2>
  </div>

</div>
      <input
  type="text"
  placeholder="Search questions..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-5 w-full rounded-xl border px-4 py-3 focus:border-emerald-500 outline-none"
/>
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3">Question</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {queries
  .filter((q) =>
    q.question
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((query) => (
            <tr
              key={query.id}
              className="border-b"
            >
              <td className="py-4">
                {query.question}
              </td>

              <td>

<span className="rounded-full bg-red-100 px-3 py-1 text-red-700">

{query.confidence}

</span>

</td>

              <td>
                {new Date(
                  query.created_at
                ).toLocaleDateString()}
              </td>

              <td>
                {query.resolved ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                    Resolved
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                    Pending
                  </span>
                )}
              </td>

              <td>
                {!query.resolved && (
                  <button
                    onClick={() => {

if(
window.confirm(
"Mark this query as resolved?"
)
){
resolve(query.id);
}

}}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                  >
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}

          {queries.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-6 text-center text-slate-500"
              >
                No unanswered queries 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UnansweredQueries;