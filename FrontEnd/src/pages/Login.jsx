// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../lib/auth.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login({ email, password });
      nav("/scan", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Could not login");
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <img className="brand-logo" src={logo} alt="Food Scanner logo" />
          <span className="brand-name">Food Scanner</span>
        </Link>

        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Access your allergy profile and scans.</p>

        {err ? <div className="alert">{err}</div> : null}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="(prototype)"
              required
            />
          </label>

          <button className="btn btn-primary auth-submit" type="submit">
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/register" className="auth-link">
            Need an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
