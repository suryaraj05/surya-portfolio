export type DeploymentStatus = "Production" | "Staging" | "Pilot" | "Archived";

export type SystemMetrics = {
  agents: number | string;
  services: number | string;
  latency: string;
  deploymentStatus: DeploymentStatus;
  reliability: string;
};

const METRICS_BY_SLUG: Record<string, SystemMetrics> = {
  "nina-voice-ai-agent-sdk": {
    agents: 4,
    services: 3,
    latency: "<120ms",
    deploymentStatus: "Production",
    reliability: "99.2% instruction match"
  },
  "visionsync-ai-preproduction-platform": {
    agents: 6,
    services: 5,
    latency: "<2.5s",
    deploymentStatus: "Production",
    reliability: "94% shot-plan acceptance"
  },
  "taxsetu-ai-tax-orchestration-system": {
    agents: 5,
    services: 4,
    latency: "<800ms",
    deploymentStatus: "Production",
    reliability: "98.5% filing-path validation"
  },
  "suryaos-core": {
    agents: 2,
    services: 4,
    latency: "<50ms",
    deploymentStatus: "Production",
    reliability: "99.9% API availability"
  },
  voxgraph: {
    agents: 3,
    services: 3,
    latency: "<400ms",
    deploymentStatus: "Pilot",
    reliability: "Pilot SLA — 97%"
  }
};

export function getSystemMetrics(slug: string, techStack: string[] = []): SystemMetrics {
  const known = METRICS_BY_SLUG[slug];
  if (known) return known;

  const depth = Math.max(2, Math.min(6, techStack.length || 3));
  return {
    agents: depth,
    services: Math.max(2, depth - 1),
    latency: "<200ms",
    deploymentStatus: "Production",
    reliability: "Production-grade SLO"
  };
}
