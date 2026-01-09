// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import AuthLanding from "./pages/AuthLanding.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";
import Allergens from "./pages/Allergens.jsx";
import Scan from "./pages/Scan.jsx";

import { getUser } from "./lib/auth.js";

function RequireAuth({ children }) {
  const [state, setState] = useState({ loading: true, authed: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await getUser();
        if (alive) setState({ loading: false, authed: !!u });
      } catch {
        if (alive) setState({ loading: false, authed: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) return <div>Checking session…</div>;
  if (!state.authed) return <Navigate to="/start" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/start" element={<AuthLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
