import { useContext } from "react";
import { Navigate, Outlet, useLocation  } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import roleAccess from "../config/roleAccess";


export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role.toLowerCase();
  const currentPath = location.pathname;
  
  const allowedRoutes = roleAccess[role] || [];

  if (!allowedRoutes.includes(currentPath)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}