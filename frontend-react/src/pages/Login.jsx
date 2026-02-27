import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),

  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/login", data);
      const resUserInfo = await api.get("/api/user");
      setUser(resUserInfo.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome {import.meta.env.VITE_APP_NAME}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
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
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-2xl border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}