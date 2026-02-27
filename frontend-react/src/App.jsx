import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import CreateClient from "./pages/CreateClient";
import CreateMember from "./pages/CreateMember";
import TeamMembers from "./pages/TeamMembers";
import ShortUrls from "./pages/ShortUrls";
import Clients from "./pages/Clients";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />

    <Routes>

      <Route
        path="/"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <></>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/create-member" element={<CreateMember />} />
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/short-urls" element={<ShortUrls />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<NotFound />} />
        
      </Route>
    </Routes>
    </>
  );
}

export default App;