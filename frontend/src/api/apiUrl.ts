const API_PORT = "5009";

export function resolveApiUrl(): string {
  const configured = import.meta.env.VITE_API_URL;
  if (typeof configured === "string" && configured.length > 0) {
    return configured;
  }

  const host =
    typeof window === "undefined" ? "localhost" : window.location.hostname;
  return `http://${host}:${API_PORT}/api`;
}
