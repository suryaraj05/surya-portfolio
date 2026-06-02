import type { MetadataRoute } from "next";
import { routeMap } from "@/lib/routes/map";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [routeMap.home, "/architecture", routeMap.projects, routeMap.contact];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === routeMap.home ? 1 : 0.7
  }));
}
