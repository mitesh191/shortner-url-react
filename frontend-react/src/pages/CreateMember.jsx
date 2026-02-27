import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import DashboardLayout from "./DashboardLayout";
import { notifySuccess, notifyError } from "../utils/notify";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  role: yup
    .string()
    .required("Role is required"),
});

export default function CreateMember() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "Member",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/api/members", data);
      reset();
      reset({ role: "Member" });
      notifySuccess("Member Added Successfully");
    } catch (err) {
      notifyError("Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Member
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Full Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter member name"
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
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter member email"
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Role
            </label>
            <select
              {...register("role")}
              className={`w-full px-4 py-3 rounded-2xl border ${
                errors.role ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500 bg-white`}
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-2">
                {errors.role.message}
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
              to="/team-member"
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