import React, { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrf() {
  await fetch("/api/auth/csrf/", { credentials: "include" });
}

async function saveAllergensRemote(list) {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");
  const res = await fetch("/api/profile/", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ allergens: list }),
  });
  if (!res.ok) throw new Error("Failed to save allergens");
  return res.json();
}

const KEY = "fs_allergens_v1";
const PRESETS = [
  "Milk",
  "Egg",
  "Peanut",
  "Tree nuts",
  "Soy",
  "Wheat/Gluten",
  "Fish",
  "Shellfish",
  "Sesame",
];

function loadAllergens() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllergens(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export default function Allergens() {
  const [items, setItems] = useState(() => loadAllergens());
  const [custom, setCustom] = useState("");

  const set = useMemo(() => new Set(items.map((x) => x.toLowerCase())), [items]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile/", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.allergens || []);
        saveAllergens(data.allergens || []);
      } catch {}
    })();
  }, []);

  async function togglePreset(name) {
    const k = name.toLowerCase();
    const next = set.has(k)
      ? items.filter((x) => x.toLowerCase() !== k)
      : [...items, name];

    setItems(next);
    saveAllergens(next);
    try {
      await saveAllergensRemote(next);
    } catch {}
  }

  async function addCustom(e) {
    e.preventDefault();
    const v = custom.trim();
    if (!v) return;
    if (set.has(v.toLowerCase())) return;

    const next = [...items, v];
    setItems(next);
    saveAllergens(next);
    setCustom("");
    try {
      await saveAllergensRemote(next);
    } catch {}
  }

  async function remove(name) {
    const k = name.toLowerCase();
    const next = items.filter((x) => x.toLowerCase() !== k);
    setItems(next);
    saveAllergens(next);
    try {
      await saveAllergensRemote(next);
    } catch {}
  }

  return (
    <div className="app">
      <AppHeader />
      <main className="container page">
        <h1 className="page-title">Allergens</h1>
        <p className="page-subtitle">
          Choose what to flag during scans. You can add custom allergens too.
        </p>

        <div className="grid2">
          <div className="panel">
            <h3 className="panel-title">Common allergens</h3>
            <div className="chips">
              {PRESETS.map((a) => {
                const on = set.has(a.toLowerCase());
                return (
                  <button
                    key={a}
                    type="button"
                    className={on ? "chip chip-on" : "chip"}
                    onClick={() => togglePreset(a)}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Your list</h3>

            <form onSubmit={addCustom} className="row">
              <input
                className="input"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Add custom allergen (e.g., ‘Mustard’)"
              />
              <button className="btn btn-primary" type="submit">
                Add
              </button>
            </form>

            <div className="list">
              {items.length === 0 ? (
                <p className="tiny-muted">No allergens selected yet.</p>
              ) : (
                items.map((a) => (
                  <div key={a} className="list-row">
                    <span>{a}</span>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => remove(a)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
