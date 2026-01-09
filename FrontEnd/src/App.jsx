import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthLanding from "./pages/AuthLanding.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Settings from "./pages/Settings.jsx";
import Allergens from "./pages/Allergens.jsx";
import Scan from "./pages/Scan.jsx";
import { API } from "./lib/api.js"; 


function RequireAuth({ children }) {
  const [state, setState] = useState({ loading: true, authed: false });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me/`, { credentials: "include" });
        const data = await res.json();
        setState({ loading: false, authed: !!data.user });
      } catch {
        setState({ loading: false, authed: false });
      }
    })();
  }, []);

if (state.loading) return <div>Checking session…</div>;
  if (!state.authed) return <Navigate to="/start" replace />;
  return children;
}




export default function App() {
  return (
    <Routes>
      {/* */}
      <Route path="/" element={<Home />} />

      {/* ✅ Auth entry */}
      <Route path="/start" element={<AuthLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/*  app */}
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/allergens"
        element={
          <RequireAuth>
            <Allergens />
          </RequireAuth>
        }
      />
      <Route
        path="/scan"
        element={
          <RequireAuth>
            <Scan />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
