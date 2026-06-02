import type { BlogDTO, ProjectDTO } from "@/src/contracts/types";

import { apiRequest } from "./client";
import { apiConfig } from "./config";

type Paginated<T> = {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
};

export async function fetchProjects(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return apiRequest<Paginated<ProjectDTO>>(`${apiConfig.apiPrefix}/projects${query}`, { revalidate: 60, tags: ["projects"] });
}

export async function fetchProjectBySlug(slug: string) {
  return apiRequest<ProjectDTO>(`${apiConfig.apiPrefix}/projects/${slug}`, {
    revalidate: 60,
    tags: [`project:${slug}`, "projects"]
  });
}

export async function fetchBlogs(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return apiRequest<Paginated<BlogDTO>>(`${apiConfig.apiPrefix}/blogs${query}`, { revalidate: 60, tags: ["blogs"] });
}

export async function fetchSettings() {
  return apiRequest<Record<string, unknown>>(`${apiConfig.apiPrefix}/settings`, { revalidate: 120, tags: ["settings"] });
}

export async function fetchDashboardOverview() {
  return apiRequest<Record<string, number>>(`${apiConfig.apiPrefix}/dashboard/overview`, { revalidate: 60, tags: ["dashboard"] });
}
