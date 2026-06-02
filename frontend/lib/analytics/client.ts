const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const API_PREFIX = "/api/v1";

type AnalyticsEventPayload = {
  event_type: string;
  visitor_id?: string;
  project_id?: number;
  country?: string;
  device?: string;
  browser?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

type VisitPayload = {
  session_id: string;
  ip_hash: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  landing_page?: string;
};

function getRegionFromLocale(locale?: string): string | undefined {
  if (!locale) return undefined;
  const parts = locale.split("-");
  return parts.length > 1 ? parts[1]?.toUpperCase() : undefined;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server_visitor";
  const existing = localStorage.getItem("surya_visitor_id");
  if (existing) return existing;
  const created = `visitor_${crypto.randomUUID()}`;
  localStorage.setItem("surya_visitor_id", created);
  return created;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  const existing = sessionStorage.getItem("surya_session_id");
  if (existing) return existing;
  const created = `session_${crypto.randomUUID()}`;
  sessionStorage.setItem("surya_session_id", created);
  return created;
}

export async function trackVisitAndPageView(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateSessionId();
  const visitorId = getOrCreateVisitorId();
  const locale = navigator.language;

  const visitPayload: VisitPayload = {
    session_id: sessionId,
    ip_hash: `client_${visitorId}`,
    country: getRegionFromLocale(locale),
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    browser: navigator.userAgent,
    os: navigator.platform,
    referrer: document.referrer || undefined,
    landing_page: path
  };

  const pagePayload: AnalyticsEventPayload = {
    event_type: "page_view",
    visitor_id: visitorId,
    country: visitPayload.country,
    device: visitPayload.device,
    browser: visitPayload.browser,
    referrer: visitPayload.referrer,
    metadata: { path }
  };

  try {
    await fetch(`${API_BASE}${API_PREFIX}/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitPayload)
    });

    await fetch(`${API_BASE}${API_PREFIX}/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagePayload)
    });
  } catch {
    // ignore analytics failures
  }
}

export async function trackEvent(event: AnalyticsEventPayload): Promise<void> {
  try {
    await fetch(`${API_BASE}${API_PREFIX}/events/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  } catch {
    // ignore analytics failures
  }
}

