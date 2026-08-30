#!/usr/bin/env python3
"""
Emit website/public/components.json for the handbook UI.
Run from repository root: python3 scripts/generate-components-json.py [output_path]
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CURSOR = ROOT / ".cursor"
OUT_DEFAULT = ROOT / "website" / "public" / "components.json"

# Override when building a fork: CURSOR_HANDBOOK_GITHUB_REPO=owner/name
DEFAULT_REPO = os.environ.get(
    "CURSOR_HANDBOOK_GITHUB_REPO", "girijashankarj/cursor-handbook"
)
DEFAULT_BRANCH = os.environ.get("CURSOR_HANDBOOK_GITHUB_BRANCH", "main")


def short_description(text: str, max_len: int = 140) -> str:
    text = (text or "").strip()
    if len(text) <= max_len:
        return text
    cut = text[: max_len + 1]
    if " " in cut:
        return cut.rsplit(" ", 1)[0] + "…"
    return text[:max_len] + "…"


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    out: dict[str, str] = {}
    for line in block.splitlines():
        m = re.match(r"^(\w+):\s*(.*)$", line.strip())
        if m:
            key, val = m.group(1), m.group(2).strip()
            if (val.startswith('"') and val.endswith('"')) or (
                val.startswith("'") and val.endswith("'")
            ):
                val = val[1:-1]
            out[key] = val
    return out


def first_heading(text: str) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return ""


def item(
    kind: str,
    rel_path: str,
    name: str,
    description: str,
    category: str,
    invocation: str | None = None,
    *,
    repo: str = DEFAULT_REPO,
    branch: str = DEFAULT_BRANCH,
) -> dict:
    blob = f"https://github.com/{repo}/blob/{branch}/{rel_path}"
    tags = [kind, category]
    inv = (invocation or "").strip()
    if inv:
        tags.append(inv.lstrip("/"))
    return {
        "id": f"{kind}:{rel_path}",
        "type": kind,
        "path": rel_path,
        "name": name,
        "description": description[:500] if description else "",
        "shortDescription": short_description(description, 140),
        "category": category,
        "tags": tags,
        "invocation": inv,
        "githubUrl": blob,
        "rawUrl": blob.replace("/blob/", "/raw/", 1),
    }


def scan_rules() -> list[dict]:
    out: list[dict] = []
    rules_dir = CURSOR / "rules"
    if not rules_dir.is_dir():
        return out
    for f in sorted(rules_dir.rglob("*.mdc")):
        rel = f.relative_to(ROOT).as_posix()
        text = f.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter(text)
        desc = fm.get("description", "").strip("'\"") or first_heading(text)
        cat = f.relative_to(rules_dir).parts[0] if f.parent != rules_dir else "core"
        out.append(item("rule", rel, f.stem, desc, cat))
    return out


def scan_agents() -> list[dict]:
    out: list[dict] = []
    agents_dir = CURSOR / "agents"
    if not agents_dir.is_dir():
        return out
    for f in sorted(agents_dir.glob("*.md")):
        rel = f.relative_to(ROOT).as_posix()
        text = f.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter(text)
        name = fm.get("name", f.stem)
        desc = fm.get("description", "") or first_heading(text)
        inv = ""
        m = re.search(r"`(/[\w-]+)`", text)
        if m:
            inv = m.group(1)
        domain = f.stem.split("-")[0] if "-" in f.stem else "general"
        out.append(item("agent", rel, name, desc, domain, inv))
    return out


def scan_skills() -> list[dict]:
    out: list[dict] = []
    skills_dir = CURSOR / "skills"
    if not skills_dir.is_dir():
        return out
    for skill_md in sorted(skills_dir.glob("**/SKILL.md")):
        rel = skill_md.relative_to(ROOT).as_posix()
        text = skill_md.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter(text)
        name = fm.get("name", skill_md.parent.name)
        desc = fm.get("description", "") or first_heading(text)
        parts = skill_md.relative_to(skills_dir).parts
        cat = parts[0] if len(parts) > 1 else "general"
        out.append(item("skill", rel, name, desc, cat))
    return out


def scan_commands() -> list[dict]:
    out: list[dict] = []
    cmd_root = CURSOR / "commands"
    if not cmd_root.is_dir():
        return out
    for f in sorted(cmd_root.rglob("*.md")):
        if f.name == "COMMAND_TEMPLATE.md":
            continue
        rel = f.relative_to(ROOT).as_posix()
        text = f.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter(text)
        name = fm.get("name", f.stem)
        desc = fm.get("description", "") or first_heading(text)
        cat = f.relative_to(cmd_root).parts[0] if f.parent != cmd_root else "general"
        inv = f"/{name}" if name else ""
        out.append(item("command", rel, name, desc, cat, inv))
    return out


def scan_hooks() -> list[dict]:
    out: list[dict] = []
    hooks_dir = CURSOR / "hooks"
    if not hooks_dir.is_dir():
        return out
    for f in sorted(hooks_dir.glob("*.sh")):
        rel = f.relative_to(ROOT).as_posix()
        first = f.read_text(encoding="utf-8", errors="replace").splitlines()[:5]
        desc = " ".join(
            line.lstrip("#").strip() for line in first if line.strip().startswith("#")
        )[:200]
        if not desc:
            desc = f"Shell hook: {f.name}"
        out.append(item("hook", rel, f.stem, desc, "hooks"))
    return out


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT_DEFAULT
    out_path.parent.mkdir(parents=True, exist_ok=True)

    components: list[dict] = []
    components.extend(scan_rules())
    components.extend(scan_agents())
    components.extend(scan_skills())
    components.extend(scan_commands())
    components.extend(scan_hooks())

    payload = {
        "generated": True,
        "repo": DEFAULT_REPO,
        "branch": DEFAULT_BRANCH,
        "componentCount": len(components),
        "components": components,
    }

    out_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(components)} components to {out_path}")


if __name__ == "__main__":
    main()
