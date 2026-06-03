import { apiConfig } from "./config";
import type { ApiError, ApiSuccess } from "@/src/contracts/types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiRequestOptions = {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  revalidate?: number;
  tags?: string[];
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiSuccess<T>> {
  let response: Response;
  try {
    response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: {
      revalidate: options.revalidate,
      tags: options.tags
    }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new Error(message);
  }

  const payload = (await response.json()) as
    | ApiSuccess<T>
    | ApiError
    | { detail?: unknown }
    | Record<string, unknown>;
  if (!response.ok || !("success" in payload) || payload.success === false) {
    let message = "Unknown API error";
    if ("error" in payload && payload.error && typeof payload.error === "object" && "message" in payload.error) {
      message = String((payload.error as { message?: unknown }).message ?? message);
    } else if ("detail" in payload) {
      const detail = (payload as { detail?: unknown }).detail;
      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: unknown } | unknown;
        if (typeof first === "object" && first && "msg" in first) {
          message = String((first as { msg?: unknown }).msg ?? message);
        } else {
          message = JSON.stringify(detail);
        }
      } else if (typeof detail === "string") {
        message = detail;
      } else if (detail) {
        message = JSON.stringify(detail);
      }
    }
    throw new Error(message);
  }

  return payload as ApiSuccess<T>;
}
