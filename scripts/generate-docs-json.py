#!/usr/bin/env python3
"""
Emit website/public/docs.json from docs/**/*.md (excluding cursor-guidelines
which are served separately via guide.json, and snaps/ which are images).

Run from repository root:
  python3 scripts/generate-docs-json.py [output_path]
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
OUT_DEFAULT = ROOT / "website" / "public" / "docs.json"

DEFAULT_REPO = os.environ.get(
    "CURSOR_HANDBOOK_GITHUB_REPO", "girijashankarj/cursor-handbook"
)
DEFAULT_BRANCH = os.environ.get("CURSOR_HANDBOOK_GITHUB_BRANCH", "main")

EXCLUDED_DIRS = {"cursor-guidelines", "snaps"}

SECTION_MAP: list[dict] = [
    {
        "id": "getting-started",
        "title": "Getting Started",
        "dir": "getting-started",
        "files": [
            "quick-start.md",
            "setup.md",
            "configuration.md",
            "prerequisites.md",
            "faq.md",
            "troubleshooting.md",
            "migration.md",
            "non-technical.md",
        ],
    },
    {
        "id": "components",
        "title": "Components",
        "dir": "components",
        "files": [
            "overview.md",
            "rules.md",
            "agents.md",
            "skills.md",
            "commands.md",
            "hooks.md",
        ],
    },
    {
        "id": "guides",
        "title": "Guides",
        "dir": "guides",
        "files": [
            "best-practices.md",
            "component-picker.md",
            "cursor-usage.md",
            "cursor-pricing-guide.md",
            "claude-ide-support.md",
            "contribution-examples.md",
        ],
    },
    {
        "id": "ai-adoption",
        "title": "AI Adoption",
        "dir": "guides/ai-adoption",
        "files": [
            "index.md",
            "cursor-ai.md",
            "github-copilot.md",
            "genai-best-practices.md",
            "token-efficiency.md",
            "model-selection.md",
            "component-creation.md",
            "workflows.md",
            "bugbot.md",
            "prompt-engineering-guidelines.md",
            "mcp-guide.md",
        ],
    },
    {
        "id": "reference",
        "title": "Reference",
        "dir": "reference",
        "files": [
            "configuration-reference.md",
            "configuration.md",
            "cursor-recognized-files.md",
            "cursor-official-features.md",
            "glossary.md",
            "sdlc-role-map.md",
            "tech-stacks.md",
            "mcp-integration.md",
            "enrichment-checklist.md",
            "examples-and-scripts.md",
            "mermaid-theme.md",
            "future-roadmap.md",
        ],
    },
    {
        "id": "security",
        "title": "Security",
        "dir": "security",
        "files": [
            "security-guide.md",
            "security-compliance.md",
            "sast-integration.md",
        ],
    },
    {
        "id": "sample-prompts",
        "title": "Sample Prompts",
        "dir": "getting-started/sample-prompts",
        "files": [
            "README.md",
            "prompts/README.md",
            "prompts/onboarding.md",
            "prompts/daily-development.md",
            "prompts/new-feature-handler.md",
            "prompts/pr-code-review.md",
            "prompts/testing-quality.md",
            "prompts/security-before-commit.md",
            "prompts/troubleshooting-debug.md",
            "prompts/customizing-config.md",
            "prompts/replicate-cursor-folder.md",
            "prompts/replicate-docs.md",
            "meta-prompts/README.md",
            "meta-prompts/onboarding-meta-prompt-for-teams.md",
            "meta-prompts/daily-development-meta-prompt-for-teams.md",
            "meta-prompts/new-feature-handler-meta-prompt-for-teams.md",
            "meta-prompts/pr-code-review-meta-prompt-for-teams.md",
            "meta-prompts/testing-quality-meta-prompt-for-teams.md",
            "meta-prompts/security-compliance-before-commit-meta-prompt-for-teams.md",
            "meta-prompts/troubleshooting-debug-meta-prompt-for-teams.md",
            "meta-prompts/cursor-folder-meta-prompt-for-teams.md",
            "meta-prompts/customizing-config-meta-prompt-for-teams.md",
            "meta-prompts/documentation-meta-prompt-for-teams.md",
        ],
    },
]

ROOT_DOCS = [
    "component-readiness.md",
    "cursor-official-docs-summary.md",
]


def title_from_markdown(text: str) -> str:
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("# "):
            return s[2:].strip()
    return "Untitled"


def doc_id(section_id: str, filename: str) -> str:
    stem = Path(filename).stem
    return f"{section_id}--{stem}"


def build_section(section: dict) -> dict:
    base = DOCS_DIR / section["dir"]
    docs: list[dict] = []
    for fname in section["files"]:
        fpath = base / fname
        if not fpath.is_file():
            print(f"  SKIP (not found): {fpath}", file=sys.stderr)
            continue
        text = fpath.read_text(encoding="utf-8", errors="replace")
        rel = fpath.relative_to(DOCS_DIR)
        docs.append(
            {
                "id": doc_id(section["id"], fname),
                "title": title_from_markdown(text),
                "path": f"docs/{rel}",
                "markdown": text,
            }
        )
    return {
        "id": section["id"],
        "title": section["title"],
        "docCount": len(docs),
        "docs": docs,
    }


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT_DEFAULT
    if not DOCS_DIR.is_dir():
        print(f"ERROR: Docs directory not found: {DOCS_DIR}", file=sys.stderr)
        sys.exit(1)

    out_path.parent.mkdir(parents=True, exist_ok=True)

    sections: list[dict] = []
    total = 0
    for sec_def in SECTION_MAP:
        sec = build_section(sec_def)
        if sec["docs"]:
            sections.append(sec)
            total += sec["docCount"]

    root_docs: list[dict] = []
    for fname in ROOT_DOCS:
        fpath = DOCS_DIR / fname
        if not fpath.is_file():
            print(f"  SKIP root doc (not found): {fpath}", file=sys.stderr)
            continue
        text = fpath.read_text(encoding="utf-8", errors="replace")
        root_docs.append(
            {
                "id": f"root--{Path(fname).stem}",
                "title": title_from_markdown(text),
                "path": f"docs/{fname}",
                "markdown": text,
            }
        )

    if root_docs:
        sections.append(
            {
                "id": "general",
                "title": "General",
                "docCount": len(root_docs),
                "docs": root_docs,
            }
        )
        total += len(root_docs)

    payload = {
        "source": "docs/",
        "repo": DEFAULT_REPO,
        "branch": DEFAULT_BRANCH,
        "sectionCount": len(sections),
        "docCount": total,
        "sections": sections,
    }
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {total} docs across {len(sections)} sections to {out_path}")


if __name__ == "__main__":
    main()
