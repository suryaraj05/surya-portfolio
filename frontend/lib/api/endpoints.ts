import type { ApiSuccess, BlogDTO, ProjectDTO } from "@/src/contracts/types";

import { apiRequest, type ApiRequestOptions } from "./client";
import { apiConfig, isApiConfigured } from "./config";

type Paginated<T> = {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
};

function emptyPaginated<T>(): ApiSuccess<Paginated<T>> {
  return {
    success: true,
    message: "API unavailable",
    data: {
      items: [],
      pagination: { total: 0, page: 1, page_size: 20, total_pages: 0 }
    }
  };
}

async function safeListRequest<T>(
  path: string,
  options: ApiRequestOptions,
  fallback: () => ApiSuccess<Paginated<T>>
): Promise<ApiSuccess<Paginated<T>>> {
  if (!isApiConfigured()) return fallback();
  try {
    return await apiRequest<Paginated<T>>(path, options);
  } catch {
    return fallback();
  }
}

async function safeRecordRequest(
  path: string,
  options: ApiRequestOptions
): Promise<ApiSuccess<Record<string, unknown>>> {
  if (!isApiConfigured()) {
    return { success: true, message: "API unavailable", data: {} };
  }
  try {
    return await apiRequest<Record<string, unknown>>(path, options);
  } catch {
    return { success: true, message: "API unavailable", data: {} };
  }
}

export async function fetchProjects(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return safeListRequest<ProjectDTO>(
    `${apiConfig.apiPrefix}/projects${query}`,
    { revalidate: 60, tags: ["projects"] },
    () => emptyPaginated<ProjectDTO>()
  );
}

export async function fetchProjectBySlug(slug: string) {
  return apiRequest<ProjectDTO>(`${apiConfig.apiPrefix}/projects/${slug}`, {
    revalidate: 60,
    tags: [`project:${slug}`, "projects"]
  });
}

export async function fetchBlogs(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return safeListRequest<BlogDTO>(
    `${apiConfig.apiPrefix}/blogs${query}`,
    { revalidate: 60, tags: ["blogs"] },
    () => emptyPaginated<BlogDTO>()
  );
}

export async function fetchSettings() {
  return safeRecordRequest(`${apiConfig.apiPrefix}/settings`, { revalidate: 120, tags: ["settings"] });
}

export async function fetchDashboardOverview() {
  return apiRequest<Record<string, number>>(`${apiConfig.apiPrefix}/dashboard/overview`, { revalidate: 60, tags: ["dashboard"] });
}
