import { useEffect, useMemo, useState, useContext  } from "react";
import DashboardLayout from "./DashboardLayout";
import api from "../services/api";
import { formatDate } from "../utils/dateFormatter";
import { notifySuccess, notifyError } from "../utils/notify";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROLE_MEMBER } from "../utils/constants";

export default function ShortUrls() {
  const { user } = useContext(AuthContext);
  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("month");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    original_url: yup
      .string()
      .trim()
      .required("URL is required")
      .url("Enter a valid URL")
      .matches(
        /^https?:\/\/.+$/,
        "URL must start with http:// or https://"
      ),
  });
  

  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/api/short-urls", data);
      reset();
      notifySuccess("Short Url Generated");
      fetchUrls?.();
    } catch (err) {
      notifyError("Failed to create short URL");
    }
  };

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/short-urls", {
        params: {
          page: page,
          search: search,
          filter: filter
        }
      });
      setUrls(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, search, filter]);

 return (
    <DashboardLayout>
      <div className="space-y-8">

        {user?.role !== "SuperAdmin" && (
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Generate Short URL
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter long URL"
                {...register("original_url")}
                className={`w-full px-4 py-3 rounded-2xl border ${
                  errors.original_url
                    ? "border-red-500"
                    : "border-gray-200"
                } focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.original_url && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.original_url.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Generating..." : "Generate"}
            </button>
          </form>
        </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
            />

            <select
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_week">Last Week</option>
              <option value="today">Today</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 w-1/8">#</th>
                  <th className="p-3 w-1/4">Short URL</th>
                  <th className="p-3 w-1/4">Long Url</th>
                  <th className="p-3 w-1/8">Hits</th>
                  {user?.role !== ROLE_MEMBER && (
                    <th className="p-3 w-1/8">Created By</th>
                  )}
                  <th className="p-3  w-1/8">Created On</th>
                </tr>
              </thead>
              <tbody>
                
                {urls.length === 0 ? (
                  <tr>
                    <td
                      colSpan={user?.role !== "Member" ? 6 : 5}
                      className="p-6 text-center text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (urls.map((item, index) => (
                  <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 w-1/8">
                        {(page - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-3 text-indigo-600 truncate font-medium max-w-xs w-1/4">
                        <a
                          href={`${item.short_code}`}
                          target="_blank"
                          title={`${item.short_code}`}
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:none"
                        >
                          {item.short_code}
                        </a>
                      </td>
                      <td className="p-3 text-indigo-600 truncate font-medium w-1/4">
                        <a
                          title={`${item.original_url}`}
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:none"
                        >
                          {item.original_url}
                        </a>
                      </td>
                      <td className="p-3 w-1/8">{item.hits}</td>
                      {user?.role !== ROLE_MEMBER && (
                        <td className="p-3 w-1/8">
                          {item.created_by}
                        </td>
                      )}
                      <td className="p-3 w-1/8">
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