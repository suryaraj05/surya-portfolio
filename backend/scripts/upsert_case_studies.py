"""Upsert NINA and VisionSync case studies into the database from markdown sources."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))

from app.db.session import SessionLocal
from app.models.entities import Project

CASE_STUDIES_DIR = REPO_ROOT / "project-case-studies"


def extract_section(markdown: str, heading: str) -> str:
    pattern = rf"^## {re.escape(heading)}\s*$"
    match = re.search(pattern, markdown, flags=re.MULTILINE)
    if not match:
        return ""
    start = match.end()
    next_heading = re.search(r"^## ", markdown[start:], flags=re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(markdown)
    return markdown[start:end].strip()


def first_paragraph(section: str) -> str:
    lines = [line.strip() for line in section.splitlines() if line.strip()]
    return lines[0] if lines else ""


def load_markdown(filename: str) -> str:
    return (CASE_STUDIES_DIR / filename).read_text(encoding="utf-8")


def upsert_project(db, **fields) -> None:
    slug = fields["slug"]
    row = db.query(Project).filter(Project.slug == slug).first()
    if row:
        for key, value in fields.items():
            setattr(row, key, value)
    else:
        db.add(Project(**fields))


def main() -> None:
    nina_md = load_markdown("nina-case-study.md")
    visionsync_md = load_markdown("visionsync-case-study.md")

    nina_summary = extract_section(nina_md, "Executive Summary")
    visionsync_summary = extract_section(visionsync_md, "Executive Summary")

    projects = [
        {
            "title": "NINA — Voice AI Agent SDK",
            "slug": "nina-voice-ai-agent-sdk",
            "short_description": first_paragraph(nina_summary)[:500],
            "full_description": nina_md,
            "problem": extract_section(nina_md, "The Problem"),
            "solution": extract_section(nina_md, "Measured and Inferred Outcomes") or extract_section(nina_md, "Lessons Learned"),
            "architecture": extract_section(nina_md, "Architecture Overview"),
            "tech_stack": ["FastAPI", "Python", "Web Speech API", "Redis", "Supabase", "TypeScript"],
            "featured": True,
            "status": "published",
            "sort_order": 1,
            "gallery_images": [],
        },
        {
            "title": "VisionSync — AI Pre-Production Platform",
            "slug": "visionsync-ai-preproduction-platform",
            "short_description": first_paragraph(visionsync_summary)[:500],
            "full_description": visionsync_md,
            "problem": extract_section(visionsync_md, "The Problem"),
            "solution": extract_section(visionsync_md, "Outcomes") or extract_section(visionsync_md, "What We Would Build Next"),
            "architecture": extract_section(visionsync_md, "High-Level Architecture") or extract_section(visionsync_md, "System Architecture"),
            "tech_stack": ["React", "TypeScript", "Express", "Firebase", "Gemini", "Node.js"],
            "featured": True,
            "status": "published",
            "sort_order": 2,
            "gallery_images": [],
        },
        {
            "title": "TaxSetu — AI Tax Orchestration System",
            "slug": "taxsetu-ai-tax-orchestration-system",
            "short_description": "Multi-agent orchestration platform for tax workflows with structured handoffs and production reliability controls.",
            "full_description": "TaxSetu is a multi-agent tax orchestration system designed for structured extraction, validation, and policy-aware execution in production workflows.",
            "problem": "Tax workflows require high accuracy, auditability, and strict agent boundaries — generic single-agent automation is insufficient.",
            "solution": "A planner-led multi-agent architecture with confidence-based routing, validation gates, and deterministic handoffs between specialized agents.",
            "architecture": "Planner coordinates extraction, validation, and policy agents with explicit failure routing and human-review fallbacks.",
            "tech_stack": ["Python", "FastAPI", "Multi-Agent Orchestration", "PostgreSQL"],
            "featured": True,
            "status": "published",
            "sort_order": 3,
            "gallery_images": [],
        },
    ]

    db = SessionLocal()
    try:
        for payload in projects:
            upsert_project(db, **payload)
        # Keep seed project but deprioritize on homepage
        core = db.query(Project).filter(Project.slug == "suryaos-core").first()
        if core:
            core.featured = False
            core.sort_order = 10
        vox = db.query(Project).filter(Project.slug == "voxgraph").first()
        if vox:
            vox.featured = False
            vox.sort_order = 11
        db.commit()
        print("Upserted case studies: nina, visionsync, taxsetu")
    finally:
        db.close()


if __name__ == "__main__":
    main()
