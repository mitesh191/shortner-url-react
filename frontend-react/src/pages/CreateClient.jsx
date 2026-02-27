import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import DashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Client name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Client email is required"),
});

export default function CreateClient() {
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
      await api.post("/api/clients", data);
      reset();
      notifySuccess("Client Created Successfully");
    } catch (err) {
      notifyError("Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Client
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Client Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter client name"
              className={`w-full px-4 py-3 rounded-2xl border ${
                errors.name ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Client Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter client email"
              className={`w-full px-4 py-3 rounded-2xl border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <Link
              to="/clients"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-400 transition"
            >
              Back
            </Link>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}