import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { logout, getUser } from "../lib/auth.js";

export default function AppHeader() {
  const nav = useNavigate();
  const loc = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser).catch(() => setUser(null));
  }, []);

  async function onLogout() {
    await logout();
    setUser(null);
    nav("/", { replace: true });
  }

  const active = (path) => (loc.pathname === path ? "navlink active" : "navlink");

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/scan" className="brand">
          <img className="brand-logo" src={logo} alt="Food Scanner logo" />
          <span className="brand-name">Food Scanner</span>
        </Link>

        <nav className="nav">
          <Link className={active("/scan")} to="/scan">Scan</Link>
          <Link className={active("/allergens")} to="/allergens">Allergens</Link>
          <Link className={active("/settings")} to="/settings">Settings</Link>
        </nav>

        <div className="right">
          <span className="tiny-muted">{user?.email ?? ""}</span>
          <button className="btn btn-outline" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
