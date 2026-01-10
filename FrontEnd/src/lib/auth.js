// src/lib/auth.js
import { apiUrl, ensureCsrf, getCookie } from "./api.js";

async function readJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.detail ||
      data?.error ||
      data?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function getUser() {
  const res = await fetch(apiUrl("/auth/me/"), { credentials: "include" });
  const data = await readJson(res);
  return data?.user || null;
}

export async function login({ email, password }) {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");

  const res = await fetch(apiUrl("/auth/login/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || ""
    },
    body: JSON.stringify({ email, password })
  });

  return readJson(res);
}

export async function register({ name, email, password }) {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");

  const res = await fetch(apiUrl("/auth/register/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || ""
    },
    body: JSON.stringify({ name, email, password })
  });

  return readJson(res);
}

export async function updateUser(payload) {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");

  const res = await fetch(apiUrl("/auth/profile/"), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || ""
    },
    body: JSON.stringify(payload)
  });

  return readJson(res);
}

export async function logout() {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");

  const res = await fetch(apiUrl("/auth/logout/"), {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": csrftoken || "" }
  });

  return readJson(res);
}
