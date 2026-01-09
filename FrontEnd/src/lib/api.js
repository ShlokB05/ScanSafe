// src/lib/api.js
export const API = "/api";

export function apiUrl(path) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API}${path}`;
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function ensureCsrf() {
  await fetch(apiUrl("/auth/csrf/"), { credentials: "include" });
}
