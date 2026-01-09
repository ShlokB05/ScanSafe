// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import { getUser, updateUser } from "../lib/auth.js";

export default function Settings() {
  const [u, setU] = useState(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setU(user);
      setName(user?.name || "");
    })();
  }, []);

  if (!u) return <div>Loading…</div>;

  async function onSave(e) {
    e.preventDefault();
    await updateUser({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="app">
      <AppHeader />
      <main className="container page">
        <h1 className="page-title">Settings</h1>

        <form onSubmit={onSave}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input value={u.email || ""} disabled />
          <button type="submit">Save</button>
          {saved && <span>Saved ✓</span>}
        </form>
      </main>
    </div>
  );
}
