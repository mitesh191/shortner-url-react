import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROLE_SUPER_ADMIN, ROLE_ADMIN } from "../utils/constants";
import {
  LayoutDashboard,
  Building2,
  Users,
  Menu,
  Link as LinkIcon, 
  LogOut,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  const { setUser  } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const [stats, setStats] = useState({
    total_clients: 0,
    total_members: 0,
    total_short_urls: 0,
    last_7_days: [],
  });

  const getLast7DaysData = (apiData) => {
  const today = new Date();
  const result = [];

  const dataMap = {};
  apiData.forEach((item) => {
    dataMap[item.date] = item.count;
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const isoDate = d.toISOString().split("T")[0];

    const formattedLabel = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    const weekday = d.toLocaleDateString("en-IN", {
      weekday: "long",
    });

    result.push({
      date: `${formattedLabel} (${weekday})`,
      count: dataMap[isoDate] || 0,
    });
  }

  return result;
};
  
  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/api/dashboard");
      setStats({
        ...data,
        last_7_days: getLast7DaysData(data.last_7_days),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const role = user?.role
  
  const menuConfig = {
    SuperAdmin: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Short Urls",
        path: "/short-urls",
        icon: <LinkIcon  size={20} />,
      },
      {
        name: "Clients",
        path: "/clients",
        icon: <Building2 size={20} />,
      },
    ],
    Admin: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Short Urls",
        path: "/short-urls",
        icon: <LinkIcon size={20} />,
      },
      {
        name: "Members",
        path: "/team-members",
        icon: <Users size={20} />,
      },
    ],
    Member: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Short Urls",
        path: "/short-urls",
        icon: <LinkIcon size={20} />,
      },
    ],
  };
  const navigate = useNavigate();
  const menuItems = menuConfig[role] || [];
  console.log("menuItems", menuItems);

  const logout = async () => {
    try {
      await api.post("/api/logout");

      setUser(null);
      navigate("/");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside
        className={`bg-white shadow-xl transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h2 className="text-lg font-bold text-indigo-600">
              {role?.toUpperCase()}
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        
        <nav className="flex-1 px-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-indigo-100 text-indigo-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        
        <div className="p-4">
          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            {role?.toUpperCase()} Dashboard
          </h1>

          <div className="text-sm font-medium text-gray-600">
            {user?.name}
          </div>
        </header>

        <main className="p-6">
          {location.pathname === "/dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {role === ROLE_SUPER_ADMIN && (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <h3 className="text-gray-500">Total Clients</h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {stats.total_clients}
                  </p>
                </div>
              )}

              {(role === ROLE_SUPER_ADMIN || role === ROLE_ADMIN) && (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <h3 className="text-gray-500">Total Members</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.total_members}
                  </p>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-gray-500">Total Short URLs</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.total_short_urls}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Short URLs Generated (Last 7 Days)
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.last_7_days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    interval={0}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis domain={[0, "auto"]} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}  
          {children}
        </main>
      </div>
    </div>
  );
}