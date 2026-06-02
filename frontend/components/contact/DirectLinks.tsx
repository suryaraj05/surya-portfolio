"use client";

import { Text } from "@/components/typography/text";
import { trackEvent, getOrCreateVisitorId } from "@/lib/analytics/client";

type DirectLinksProps = {
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
};

export function DirectLinks({ email, linkedinUrl, githubUrl, resumeUrl }: DirectLinksProps) {
  async function trackLink(eventType: string, target: string) {
    const visitorId = getOrCreateVisitorId();
    await trackEvent({
      event_type: eventType,
      visitor_id: visitorId,
      metadata: { target, source: "/contact" }
    });
  }

  return (
    <div className="not-prose space-y-4">
      {email ? (
        <div>
          <Text tone="muted" size="sm">
            Email
          </Text>
          <a
            href={`mailto:${email}`}
            onClick={() => trackLink("contact_email_click", email)}
            className="text-base underline underline-offset-4"
          >
            {email}
          </a>
        </div>
      ) : null}

      {linkedinUrl ? (
        <div>
          <Text tone="muted" size="sm">
            LinkedIn
          </Text>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackLink("linkedin_click", linkedinUrl)}
            className="text-base underline underline-offset-4"
          >
            Open LinkedIn
          </a>
        </div>
      ) : null}

      {githubUrl ? (
        <div>
          <Text tone="muted" size="sm">
            GitHub
          </Text>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackLink("github_click", githubUrl)}
            className="text-base underline underline-offset-4"
          >
            Open GitHub
          </a>
        </div>
      ) : null}

      {resumeUrl ? (
        <div>
          <Text tone="muted" size="sm">
            Resume
          </Text>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackLink("resume_download", resumeUrl)}
            className="text-base underline underline-offset-4"
          >
            Download Resume
          </a>
        </div>
      ) : null}
    </div>
  );
}

