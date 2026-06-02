export const apiConfig = {
  baseUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, ""),
  apiPrefix: "/api/v1"
} as const;
