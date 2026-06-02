import type { ProjectDTO } from "@/src/contracts/types";
import type { ProjectNavItem } from "@/lib/case-study/types";

import { fetchBlogs, fetchProjectBySlug, fetchProjects, fetchSettings } from "@/lib/api/endpoints";

export async function getProjectsForCaseStudies() {
  const response = await fetchProjects({ page: "1", page_size: "20", status: "published", sort_by: "sort_order", sort_order: "asc" });
  return response.data.items;
}

export async function getEditorialBlogs() {
  const response = await fetchBlogs({ page: "1", page_size: "20", published: "true", sort_by: "published_at", sort_order: "desc" });
  return response.data.items;
}

export async function getSiteSettings() {
  const response = await fetchSettings();
  return response.data;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDTO> {
  const response = await fetchProjectBySlug(slug);
  return response.data;
}

export async function getProjectDetailContext(slug: string): Promise<{
  project: ProjectDTO;
  relatedProjects: ProjectNavItem[];
  previousProject?: ProjectNavItem;
  nextProject?: ProjectNavItem;
}> {
  const [projectResponse, projectsResponse] = await Promise.all([
    fetchProjectBySlug(slug),
    fetchProjects({
      page: "1",
      page_size: "100",
      status: "published",
      sort_by: "sort_order",
      sort_order: "asc"
    })
  ]);

  const project = projectResponse.data;
  const list = projectsResponse.data.items;
  const navList: ProjectNavItem[] = list.map((item) => ({
    slug: item.slug,
    title: item.title,
    short_description: item.short_description
  }));

  const currentIndex = navList.findIndex((item) => item.slug === project.slug);
  const previousProject = currentIndex > 0 ? navList[currentIndex - 1] : undefined;
  const nextProject = currentIndex >= 0 && currentIndex < navList.length - 1 ? navList[currentIndex + 1] : undefined;
  const relatedProjects = navList.filter((item) => item.slug !== project.slug).slice(0, 4);

  return {
    project,
    relatedProjects,
    previousProject,
    nextProject
  };
}
