const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API = `${API_ORIGIN}/api`;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function ensureCsrf() {
  await fetch(`${API}/auth/csrf/`, { credentials: "include" });
  return getCookie("csrftoken") || "";
}

export async function getUser() {
  const res = await fetch(`${API}/auth/me/`, { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  return data.user ?? null;
}

export async function login({ email, password }) {
  const csrf = await ensureCsrf();
  const res = await fetch(`${API}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Could not login");
  return data.user ?? null;
}

export async function register({ name, email, password }) {
  const csrf = await ensureCsrf();
  const res = await fetch(`${API}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Could not register");
  return data.user ?? null;
}

export async function updateUser(patch) {
  const csrf = await ensureCsrf();
  const res = await fetch(`${API}/profile/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
    credentials: "include",
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Could not update user");
  return data ?? null;
}

export async function logout() {
  const csrf = await ensureCsrf();
  await fetch(`${API}/auth/logout/`, {
    method: "POST",
    headers: { "X-CSRFToken": csrf },
    credentials: "include",
  });
}
