#!/usr/bin/env python3
"""
Emit website/public/guide.json from docs/cursor-guidelines/chapters/*.md
Run from repository root:
  python3 scripts/generate-guide-json.py [output_path]
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS_DIR = ROOT / "docs" / "cursor-guidelines" / "chapters"
OUT_DEFAULT = ROOT / "website" / "public" / "guide.json"

DEFAULT_REPO = os.environ.get(
    "CURSOR_HANDBOOK_GITHUB_REPO", "girijashankarj/cursor-handbook"
)
DEFAULT_BRANCH = os.environ.get("CURSOR_HANDBOOK_GITHUB_BRANCH", "main")


def title_from_markdown(text: str) -> str:
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("# "):
            return s[2:].strip()
    return "Untitled"


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT_DEFAULT
    if not CHAPTERS_DIR.is_dir():
        print(f"ERROR: Chapters directory not found: {CHAPTERS_DIR}", file=sys.stderr)
        sys.exit(1)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    sections: list[dict[str, str]] = []
    for f in sorted(CHAPTERS_DIR.glob("*.md")):
        text = f.read_text(encoding="utf-8", errors="replace")
        sections.append(
            {
                "id": f.stem,
                "title": title_from_markdown(text),
                "markdown": text,
            }
        )

    payload = {
        "source": "docs/cursor-guidelines/chapters",
        "repo": DEFAULT_REPO,
        "branch": DEFAULT_BRANCH,
        "sectionCount": len(sections),
        "sections": sections,
    }
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(sections)} sections to {out_path}")


if __name__ == "__main__":
    main()
