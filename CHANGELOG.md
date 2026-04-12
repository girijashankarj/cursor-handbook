# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.1] - 2026-04-13

### Added

- `README.npm.md`: npm-friendly README without Mermaid diagrams; `prepublishOnly`/`postpublish` lifecycle scripts in `package.json` swap it during `npm publish`
- `.npmignore`: exclude README swap artifacts (`README.npm.md`, `README.github.md`) from published package
- README badge refresh: node version, colored stars/forks badges, version bump to 1.5.1

## [1.5.0] - 2026-04-13

### Added

- **Docs page** on handbook website (`#docs`): surfaces 71 markdown docs from `docs/` across 8 sections (Getting Started, Components, Guides, AI Adoption, Reference, Security, Sample Prompts, General) with sidebar navigation, search, Mermaid rendering, and prev/next navigation
- Script `scripts/generate-docs-json.py` to build `website/public/docs.json` from `docs/` markdown files
- npm publish URL and badges: linked [npmjs.com/package/cursor-handbook](https://www.npmjs.com/package/cursor-handbook) across README, Quick Start, SETUP-GUIDE, package.json, and handbook website header/footer
- Rule `response-summary.mdc`: optional assistive footer (files, tools; honest note on token metrics)
- Commands: `/commit-message`, `/pr-description`, `/fix-vulnerable-deps`; skill `dependency-remediation`
- Docs: `docs/reference/sdlc-role-map.md`, `docs/getting-started/non-technical.md`; AGENTS.md pointer for non-developers
- Handbook website (`website/`): Vite static UI, `scripts/generate-components-json.py`, GitHub Pages workflow
- **Cursor guidelines:** `docs/cursor-guidelines/` chapters, `scripts/generate-guide-json.py`, **Guidelines** view on the handbook site (markdown + TOC + search; third-party / trademark disclaimer)
- **Cursor guidelines (depth):** vocabulary (`globs`, `alwaysApply`, skill/agent keywords), Settings discovery, hooks event table, Agent terminal + sandbox links, VS Code & IntelliJ migration checklists, mermaid diagrams; UI disclaimer reinforces Cursor IP
- Rules engine branding (replaced "configuration boilerplate")
- Star CTA, Table of Contents, Before vs After, Who is this for sections
- One-line install command
- Marketing images (hero, before-after, who-uses)
- docs/snaps/README.md with image index

### Changed

- README overhaul: simplified install table (6 options), replaced flow-chart diagram with sequence diagram, added "What's Inside" and "Component Deep Dive" sections, removed verbose sub-category Mermaid breakdowns
- Website component metadata: corrected agent names/descriptions, removed stale `test-coverage` command, component count 210 → 209
- Website navigation: added Docs tab and `D` keyboard shortcut
- Cursor official best practices documented (500-line rule, etc.)
- CONTRIBUTING agent location, troubleshooting hooks section
- Active vs available hooks documented

## [1.4.0] - 2026-03-06

### Added

- Clear installation options (Cursor UI import, Clone & Customize, Team-Level Config)
- "About This Repo" section for expectation-setting
- "After-Setup" guidance (security, tokens, customization)
- "Cross-Tool Compatibility" section (CLAUDE.md, AGENTS.md, SKILL.md)
- "Adoption Model" with layered approach diagram
- "Limitations" section
- 13 Mermaid diagrams across all sections

### Changed

- Replaced Git submodule/subtree installation with simpler options
- Deduplicated security and token content

## [1.3.0] - 2026-02-07

### Changed

- Reorganized documentation into focused guides in `docs/`
- Improved navigation and discoverability

## [1.2.0] - 2026-02-07

### Added

- Quick Start section and TL;DR summaries
- Screenshots from `docs/snaps/`
- Version badges

## [1.1.0] - 2026-02-07

### Added

- Cursor Hooks documentation (12 hooks)
- Future Roadmap

## [1.0.0] - 2025-02-07

### Added

- Initial release with 110 components
- 29 rules, 34 agents, 21 skills, 14 commands, 12 hooks
- 9 stack-specific example configurations
- Central `project.json` configuration system
- Security guardrails and token efficiency rules
