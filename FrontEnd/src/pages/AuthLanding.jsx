// src/pages/AuthLanding.jsx
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getUser } from "../lib/auth.js";
import logo from "../assets/logo.png";

export default function AuthLanding() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    getUser()
      .then((u) => {
        if (alive) setStatus(u ? "authed" : "guest");
      })
      .catch(() => {
        if (alive) setStatus("guest");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") return <div>Checking session…</div>;
  if (status === "authed") return <Navigate to="/scan" replace />;

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand auth-brand">
          <img className="brand-logo" src={logo} alt="Food Scanner logo" />
          <span className="brand-name">Food Scanner</span>
        </div>

        <h1 className="auth-title">Welcome</h1>
        <p className="auth-subtitle">
          Create an account to save your allergen profile and scan history.
        </p>

        <div className="stack">
          <Link className="btn btn-primary auth-submit" to="/register">
            Register
          </Link>
          <Link className="btn btn-outline auth-submit" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
