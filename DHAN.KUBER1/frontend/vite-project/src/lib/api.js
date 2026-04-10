const defaultApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;

export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiBaseUrl;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("dhankuber_token");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("dhankuber_token");
    localStorage.removeItem("dhankuber_user");
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}
