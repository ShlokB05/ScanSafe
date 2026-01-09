import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { register } from "../lib/auth.js";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");    
  const [err, setErr] = useState("");

  async function onSubmit(e) {                     
    e.preventDefault();
    setErr("");
    try {
      await register({ name, email, password });    
      nav("/scan", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Could not register");
    }}


  return (
    <div className="auth">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <img className="brand-logo" src={logo} alt="Food Scanner logo" />
          <span className="brand-name">Food Scanner</span>
        </Link>

        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">Set up your account in 30 seconds. By registering you agree that this project is just for testing and not meant to be a genuine allergy checker due to limits of Ocr. </p>

        {err ? <div className="alert">{err}</div> : null}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </label>


          <button className="btn btn-primary auth-submit" type="submit">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
