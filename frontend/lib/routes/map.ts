export const routeMap = {
  home: "/",
  company: "/company",
  projects: "/projects",
  projectDetail: "/projects/[slug]",
  caseStudies: "/case-studies",
  caseStudyDetail: "/case-studies/[slug]",
  insights: "/insights",
  insightDetail: "/insights/[slug]",
  contact: "/contact",
  legalPrivacy: "/legal/privacy",
  legalTerms: "/legal/terms"
} as const;

export type AppRouteKey = keyof typeof routeMap;
