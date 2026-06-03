const DEFAULT_API_URL = "http://localhost:8000";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function isApiConfigured(): boolean {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) return true;
  // On Vercel, require an explicit API URL — never default to localhost at build time.
  return !process.env.VERCEL;
}

export const apiConfig = {
  baseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL),
  apiPrefix: "/api/v1"
} as const;
