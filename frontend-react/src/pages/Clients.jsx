import { useEffect, useMemo, useState, useContext  } from "react";
import DashboardLayout from "./DashboardLayout";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/clients", {
        params: {
          page: page,
          search: search
        }
      });

      setClients(res.data.data);
      setLastPage(res.data.last_page);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, search]);

 

 

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-3xl shadow-xl p-6">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
            />
            <button
                onClick={() => navigate("/create-client")}
                className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
            >Add Client
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Client Name</th>
                  <th className="p-3">Users</th>
                  <th className="p-3">Total Generated URLs</th>
                  <th className="p-3">Created On</th>
                </tr>
              </thead>
              <tbody>
                
                {clients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (clients.map((item, index) => (
                <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {(page - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 truncate max-w-xs">
                      {item.name}
                      <br/>
                      {item.email}
                    </td>
                    <td className="p-3 font-medium">
                      {item.users}
                    </td>
                    <td className="p-3 font-medium">
                      {item.total_urls}
                    </td>
                    <td className="p-3 font-medium">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
               ))
              )}
              </tbody>
            </table>
             {loading && <p className="mt-4">Loading...</p>}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Prev
            </button>

            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}