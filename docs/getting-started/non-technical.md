# Getting started (non-technical)

You do **not** need to write code to use **cursor-handbook** with Cursor IDE. This handbook is **optional**: it adds rules, skills, and agents so the AI follows your standards. You can skip anything that does not apply to your work.

## What you get

- **Clearer writing** for docs, specs, and meeting notes when you use agents such as **Requirements** (`/requirements-agent`) or **Documentation** (`/docs-agent`).
- **Consistent structure** for tasks and estimates (see [SDLC role map](../reference/sdlc-role-map.md)).
- **Plain-language** guidance: the AI can summarize technical work for stakeholders when you ask it to.

## What you do not need

- Installing extra programming runtimes *for the handbook itself* — the handbook is configuration and documentation for Cursor.
- Copying every file — pick only what helps you (rules for docs, specific agents, or skills).

## Three easy ways to use the project

### 1. Add from GitHub in Cursor (no clone)

1. Open **Cursor Settings → Rules / Skills / Agents** (or the equivalent for your Cursor version).
2. Choose **Add from GitHub** and paste the repository URL:  
   `https://github.com/girijashankarj/cursor-handbook`
3. Add only the components you want.

### 2. Clone and copy folders

1. Clone the repo (or download ZIP from GitHub).
2. Copy the `.cursor` folder (or parts of it) into your project.
3. Optional: edit `.cursor/config/project.json` with your project name and preferences.

### 3. Ask a developer on your team

They can copy the handbook into your shared repo or subset rules for **documentation paths** only (e.g. `docs/**`).

## Using AI safely

- Do **not** paste secrets, passwords, or personal data into chat.
- Prefer **summaries** of meetings and **user IDs** instead of full names in prompts when possible.

## Where to go next

| Goal | Link |
|------|------|
| Full list of components | [COMPONENT_INDEX.md](../../COMPONENT_INDEX.md) |
| What Cursor recognizes | [Cursor-recognized files](../reference/cursor-recognized-files.md) |
| Map by SDLC role | [SDLC role map](../reference/sdlc-role-map.md) |
| Public handbook website (browse, search) | [Handbook website](https://girijashankarj.github.io/cursor-handbook/) — use **Guidelines** for [Cursor topics](https://girijashankarj.github.io/cursor-handbook/#guide) |

## This step is optional

Using cursor-handbook is **not mandatory**. You can use Cursor with zero copied files, or only copy documentation from this repo. The command-line and **Add from GitHub** flows are equally valid.
