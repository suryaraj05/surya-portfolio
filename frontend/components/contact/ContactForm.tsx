"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography/text";
import {
  getOrCreateSessionId,
  getOrCreateVisitorId,
  trackEvent,
  trackVisitAndPageView
} from "@/lib/analytics/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  projectType: "Startup" | "Enterprise" | "Agency" | "Personal Project" | "Research";
  budgetRange: "< $1k" | "$1k - $5k" | "$5k - $10k" | "$10k+";
  timeline: "ASAP" | "1 Month" | "3 Months" | "Flexible";
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  projectType: "Startup",
  budgetRange: "$1k - $5k",
  timeline: "1 Month",
  message: ""
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [started, setStarted] = useState(false);

  const isValid = useMemo(() => {
    return (
      state.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
      state.message.trim().length >= 12
    );
  }, [state]);

  async function handleStart() {
    if (started) return;
    setStarted(true);
    const visitorId = getOrCreateVisitorId();
    await trackVisitAndPageView("/contact");
    await trackEvent({
      event_type: "contact_form_start",
      visitor_id: visitorId,
      metadata: { source: "contact_page" }
    });
  }

  async function handleFieldComplete(field: keyof FormState) {
    const visitorId = getOrCreateVisitorId();
    await trackEvent({
      event_type: "contact_field_completion",
      visitor_id: visitorId,
      metadata: { field }
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleStart();

    if (!isValid) {
      setStatus("error");
      setErrorMessage("Please provide your name, a valid email, and a clear message.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const sourceUrl = window.location.href;
    const referrer = document.referrer || "direct";
    const timestamp = new Date().toISOString();
    const countryGuess = navigator.language.includes("-")
      ? navigator.language.split("-")[1]?.toUpperCase()
      : undefined;

    const backendMessage = [
      state.message.trim(),
      "",
      "--- Lead Qualification ---",
      `Project Type: ${state.projectType}`,
      `Budget Range: ${state.budgetRange}`,
      `Timeline: ${state.timeline}`,
      "",
      "--- Tracking Context ---",
      `Source URL: ${sourceUrl}`,
      `Referrer: ${referrer}`,
      `Timestamp: ${timestamp}`,
      `Visitor ID: ${visitorId}`,
      `Session ID: ${sessionId}`,
      `Country: ${countryGuess ?? "unknown"}`
    ].join("\n");

    const payload = {
      name: state.name.trim(),
      email: state.email.trim(),
      company: state.company.trim() || undefined,
      role: state.role.trim() || undefined,
      message: backendMessage,
      source_page: sourceUrl,
      country: countryGuess,
      ip_address: undefined
    };

    try {
      const response = await fetch(`${API_BASE}${API_PREFIX}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error?.message ?? "Unable to submit contact form");
      }

      await trackEvent({
        event_type: "contact_form_submission",
        visitor_id: visitorId,
        metadata: {
          projectType: state.projectType,
          budgetRange: state.budgetRange,
          timeline: state.timeline
        }
      });

      setStatus("success");
      setState(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Submission failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose grid gap-5 rounded-xl border border-border bg-background p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Name</span>
          <input
            required
            value={state.name}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("name")}
            onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Email</span>
          <input
            required
            type="email"
            value={state.email}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("email")}
            onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Company</span>
          <input
            value={state.company}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("company")}
            onChange={(e) => setState((prev) => ({ ...prev, company: e.target.value }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Role</span>
          <input
            value={state.role}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("role")}
            onChange={(e) => setState((prev) => ({ ...prev, role: e.target.value }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Project Type</span>
          <select
            value={state.projectType}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("projectType")}
            onChange={(e) => setState((prev) => ({ ...prev, projectType: e.target.value as FormState["projectType"] }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option>Startup</option>
            <option>Enterprise</option>
            <option>Agency</option>
            <option>Personal Project</option>
            <option>Research</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Budget Range</span>
          <select
            value={state.budgetRange}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("budgetRange")}
            onChange={(e) => setState((prev) => ({ ...prev, budgetRange: e.target.value as FormState["budgetRange"] }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option>&lt; $1k</option>
            <option>$1k - $5k</option>
            <option>$5k - $10k</option>
            <option>$10k+</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Timeline</span>
          <select
            value={state.timeline}
            onFocus={handleStart}
            onBlur={() => handleFieldComplete("timeline")}
            onChange={(e) => setState((prev) => ({ ...prev, timeline: e.target.value as FormState["timeline"] }))}
            className="h-11 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option>ASAP</option>
            <option>1 Month</option>
            <option>3 Months</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Message</span>
        <textarea
          required
          rows={7}
          value={state.message}
          onFocus={handleStart}
          onBlur={() => handleFieldComplete("message")}
          onChange={(e) => setState((prev) => ({ ...prev, message: e.target.value }))}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Tell me what you're building, current constraints, and what outcomes you want."
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Send Inquiry"}
        </Button>
        {status === "success" ? <Text size="sm">Thanks — your message was sent successfully.</Text> : null}
        {status === "error" ? (
          <Text size="sm" className="text-red-600">
            {errorMessage}
          </Text>
        ) : null}
      </div>
    </form>
  );
}

