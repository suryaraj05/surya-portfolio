import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyDocument } from "@/components/case-study";
import { getProjectBySlug, getProjectDetailContext } from "@/lib/cms/content";
import { buildMetadata } from "@/lib/seo/metadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    const description = project.short_description ?? project.full_description ?? "Engineering case study";
    return buildMetadata({
      title: `${project.title} | SuryaOS`,
      description,
      path: `/projects/${project.slug}`,
      openGraphImage: project.cover_image ?? undefined
    });
  } catch {
    return buildMetadata({
      title: "Project Not Found | SuryaOS",
      description: "Requested project case study is unavailable.",
      path: `/projects/${slug}`
    });
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  try {
    const { project, relatedProjects, previousProject, nextProject } = await getProjectDetailContext(slug);

    return (
      <CaseStudyDocument
        project={project}
        relatedProjects={relatedProjects}
        previousProject={previousProject}
        nextProject={nextProject}
      />
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}

