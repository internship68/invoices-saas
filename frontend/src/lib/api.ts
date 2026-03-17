if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not set. Please configure frontend/.env");
}

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: <TRes = unknown>(path: string) =>
    request(path, { method: "GET" }) as Promise<TRes>,
  post: <TBody, TRes = unknown>(path: string, body: TBody) =>
    request(path, { method: "POST", body: JSON.stringify(body) }) as Promise<TRes>,
  put: <TBody, TRes = unknown>(path: string, body: TBody) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }) as Promise<TRes>,
  delete: <TRes = unknown>(path: string) =>
    request(path, { method: "DELETE" }) as Promise<TRes>,
};

