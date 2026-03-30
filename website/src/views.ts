import { marked } from "marked";
import { currentSiteMeta, hydrateRepoStats, repoUrl } from "./services";
import { parseHash, replaceBrowseHash, setGuideHash } from "./router";
import { syncThemeControlUi } from "./theme";
import type { BrowseFilters, Component, GuidePayload, GuideSection, Payload } from "./types";
import { debounce, escapeHtml, sanitizeHtmlFragment } from "./ui";

marked.setOptions({ gfm: true });

/** Lazy-loaded so Browse view does not download Mermaid. */
let mermaidApi: typeof import("mermaid").default | null = null;

const CURSOR_DOCS = "https://cursor.com/docs";
const CURSOR_RULES = "https://cursor.com/docs/rules";
const ASSET_BASE = import.meta.env.BASE_URL;

function icon(name: "search" | "filter" | "folder" | "github" | "download" | "copy" | "book" | "compass" | "clock" | "list" | "arrowUp" | "rule" | "agent" | "skill" | "command" | "hook" | "chevronLeft" | "chevronRight"): string {
  const common = `class="ui-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"`;
  if (name === "search") return `<svg ${common}><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4 4"/></svg>`;
  if (name === "filter") return `<svg ${common}><path d="M3 5h14M6 10h8M8 15h4"/></svg>`;
  if (name === "folder") return `<svg ${common}><path d="M2.5 6.5h5l1.8 2h7.2v7.5H2.5z"/></svg>`;
  if (name === "github") return `<svg ${common}><path d="M10 2.5a7.5 7.5 0 0 0-2.4 14.6c.4.1.5-.2.5-.4v-1.3c-2 .4-2.5-.8-2.5-.8-.3-.8-.9-1-1-1-.8-.5 0-.5 0-.5.8 0 1.3.8 1.3.8.8 1.2 2 .9 2.5.7.1-.5.3-.9.6-1.1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.3 7.3 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.6.7.6 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 10 2.5z"/></svg>`;
  if (name === "download") return `<svg ${common}><path d="M10 3v9"/><path d="M6.5 9.5 10 13l3.5-3.5"/><path d="M3.5 16.5h13"/></svg>`;
  if (name === "copy") return `<svg ${common}><rect x="7" y="7" width="9" height="9" rx="1.5"/><rect x="4" y="4" width="9" height="9" rx="1.5"/></svg>`;
  if (name === "book") return `<svg ${common}><path d="M4 4.5h6.5a2 2 0 0 1 2 2V16H6a2 2 0 0 1-2-2z"/><path d="M12.5 6.5A2 2 0 0 1 14.5 4.5H16v9.5h-3.5z"/></svg>`;
  if (name === "compass") return `<svg ${common}><circle cx="10" cy="10" r="7"/><path d="m12.8 7.2-1.5 5-5 1.5 1.5-5z"/></svg>`;
  if (name === "clock") return `<svg ${common}><circle cx="10" cy="10" r="7"/><path d="M10 6.5v4l2.8 1.7"/></svg>`;
  if (name === "list") return `<svg ${common}><path d="M6 5h10M6 10h10M6 15h10"/><circle cx="3.5" cy="5" r=".8" fill="currentColor"/><circle cx="3.5" cy="10" r=".8" fill="currentColor"/><circle cx="3.5" cy="15" r=".8" fill="currentColor"/></svg>`;
  if (name === "rule") return `<svg ${common}><path d="M4 4.5h12v11H4z"/><path d="M7 8h6M7 11h6"/></svg>`;
  if (name === "agent") return `<svg ${common}><circle cx="10" cy="7" r="2.5"/><path d="M5.5 15.5a4.5 4.5 0 0 1 9 0"/></svg>`;
  if (name === "skill") return `<svg ${common}><path d="M10 3.5 12 7l3.8.6-2.7 2.6.7 3.8-3.8-2-3.8 2 .7-3.8-2.7-2.6L8 7z"/></svg>`;
  if (name === "command") return `<svg ${common}><path d="M3.5 6h13M3.5 10h8M3.5 14h13"/></svg>`;
  if (name === "hook") return `<svg ${common}><path d="M13 6a3 3 0 1 0-3 3h1a2.5 2.5 0 1 1-2.5 2.5"/></svg>`;
  if (name === "chevronLeft") return `<svg ${common}><path d="m12.5 5.5-5 4.5 5 4.5"/></svg>`;
  if (name === "chevronRight") return `<svg ${common}><path d="m7.5 5.5 5 4.5-5 4.5"/></svg>`;
  return `<svg ${common}><path d="M10 15V5"/><path d="M6.5 8.5 10 5l3.5 3.5"/><path d="M3.5 16.5h13"/></svg>`;
}

const TYPE_ICON_NAME: Record<string, "rule" | "agent" | "skill" | "command" | "hook"> = {
  rule: "rule",
  agent: "agent",
  skill: "skill",
  command: "command",
  hook: "hook",
};

function normalize(s: string): string {
  return s.toLowerCase();
}

function matchesQuery(c: Component, q: string): boolean {
  if (!q.trim()) return true;
  const n = normalize(q);
  const tagHit = c.tags?.some((t) => normalize(t).includes(n)) ?? false;
  return (
    normalize(c.name).includes(n) ||
    normalize(c.description).includes(n) ||
    normalize(c.path).includes(n) ||
    normalize(c.category).includes(n) ||
    normalize(c.type).includes(n) ||
    tagHit ||
    normalize(c.invocation || "").includes(n)
  );
}

function matchesGuideSection(s: GuideSection, q: string): boolean {
  if (!q.trim()) return true;
  const n = normalize(q);
  return normalize(s.title).includes(n) || normalize(s.markdown).includes(n);
}

function estimateReadMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-\[\]\(\)]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const TYPE_ORDER = ["rule", "agent", "skill", "command", "hook"] as const;
const TYPE_LABEL: Record<string, string> = {
  rule: "Rules",
  agent: "Agents",
  skill: "Skills",
  command: "Commands",
  hook: "Hooks",
};

const TYPE_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "rule", label: "Rules" },
  { value: "agent", label: "Agents" },
  { value: "skill", label: "Skills" },
  { value: "command", label: "Commands" },
  { value: "hook", label: "Hooks" },
];

function uniqueCategories(components: Component[]): string[] {
  const s = new Set(components.map((c) => c.category));
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

function groupForBrowse(
  list: Component[],
): { typeKey: string; typeLabel: string; byCategory: Map<string, Component[]> }[] {
  const byType = new Map<string, Component[]>();
  for (const c of list) {
    const arr = byType.get(c.type) ?? [];
    arr.push(c);
    byType.set(c.type, arr);
  }
  const out: {
    typeKey: string;
    typeLabel: string;
    byCategory: Map<string, Component[]>;
  }[] = [];
  for (const typeKey of TYPE_ORDER) {
    const items = byType.get(typeKey);
    if (!items?.length) continue;
    byType.delete(typeKey);
    const catMap = new Map<string, Component[]>();
    for (const c of items) {
      const k = c.category || "general";
      const arr = catMap.get(k) ?? [];
      arr.push(c);
      catMap.set(k, arr);
    }
    const sortedCats = Array.from(catMap.keys()).sort((a, b) => a.localeCompare(b));
    const ordered = new Map<string, Component[]>();
    for (const cat of sortedCats) ordered.set(cat, catMap.get(cat)!);
    out.push({ typeKey, typeLabel: TYPE_LABEL[typeKey] ?? typeKey, byCategory: ordered });
  }
  for (const [typeKey, items] of byType) {
    if (!items.length) continue;
    const catMap = new Map<string, Component[]>();
    for (const c of items) {
      const k = c.category || "general";
      const arr = catMap.get(k) ?? [];
      arr.push(c);
      catMap.set(k, arr);
    }
    const sortedCats = Array.from(catMap.keys()).sort((a, b) => a.localeCompare(b));
    const ordered = new Map<string, Component[]>();
    for (const cat of sortedCats) ordered.set(cat, catMap.get(cat)!);
    out.push({ typeKey, typeLabel: TYPE_LABEL[typeKey] ?? typeKey, byCategory: ordered });
  }
  return out;
}

function disclaimerStrip(compact: boolean): string {
  const body = compact
    ? `<strong>cursor-handbook</strong> — independent of Cursor. <em>Cursor</em>, <em>Cursor IDE</em>, and official Cursor docs are <strong>Cursor / Anysphere rights</strong>. Not affiliated or endorsed. <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">cursor.com/docs</a> · <a href="${CURSOR_RULES}" target="_blank" rel="noopener">Rules</a>.`
    : `<p><strong>Cursor product rights.</strong> <em>Cursor</em>, <em>Cursor IDE</em>, logos, user interface, and official documentation are <strong>intellectual property of Cursor and its licensors</strong> (e.g. Anysphere, Inc.). All such rights remain with their owners. This <strong>cursor-handbook</strong> site and repository are <strong>community-maintained</strong> and <strong>not affiliated, endorsed, or sponsored</strong> by Cursor.</p>
       <p>For authoritative behavior (<code>globs</code>, <code>alwaysApply</code>, hooks, sandbox, models), use <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">cursor.com/docs</a> — especially <a href="${CURSOR_RULES}" target="_blank" rel="noopener">cursor.com/docs/rules</a>.</p>`;
  return `<aside class="mb-4 rounded-xl border border-slate-300 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-900/60 ${compact ? "py-2 text-xs" : "py-3 text-sm"} text-slate-700 dark:text-slate-300" role="note">${body}</aside>`;
}

function siteNav(active: "browse" | "guide"): string {
  const base = "app-nav-tab inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors";
  const activeCls = "is-active";
  const idleCls = "";
  const b = active === "browse"
    ? `<span class="${base} ${activeCls}">Browse</span>`
    : `<a class="${base} ${idleCls}" href="#browse">Browse</a>`;
  const g = active === "guide"
    ? `<span class="${base} ${activeCls}">Guidelines</span>`
    : `<a class="${base} ${idleCls}" href="#guide">Guidelines</a>`;
  const repo = `<a class="${base}" href="${repoUrl()}" target="_blank" rel="noopener">Repository</a>`;
  return `<nav class="flex items-center gap-2" aria-label="Main">${b} ${g} ${repo}</nav>`;
}

function topChrome(active: "browse" | "guide"): string {
  return `<div class="app-header sticky top-0 z-40 mb-3 rounded-xl border px-3 py-2 shadow-sm sm:px-4">
  <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
    <a class="app-brand inline-flex items-center gap-2 rounded-md px-2 py-0.5 text-sm font-bold" href="#browse" aria-label="Home — cursor-handbook">
      <img class="h-7 w-7 rounded-lg" src="${ASSET_BASE}favicon.svg" width="28" height="28" alt="" decoding="async" />
      <span>cursor-handbook</span>
    </a>
    <div class="order-3 w-full sm:order-2 sm:w-auto">${siteNav(active)}</div>
    <div class="ml-auto order-2 sm:order-3"><button type="button" class="theme-cycle app-theme-btn inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition" aria-label="Color theme" title="Theme"><span class="theme-cycle__text">Theme</span></button></div>
  </div>
</div>`;
}

function docsLeftRail(active: "browse" | "guide"): string {
  const link = (href: string, label: string, isActive = false) =>
    `<a href="${href}" class="docs-rail-link ${isActive ? "is-active" : ""}">${label}</a>`;
  return `<aside class="docs-left" aria-label="Documentation navigation">
    <p class="docs-rail-heading">Get started</p>
    <nav class="docs-rail-group">
      ${link("#overview", "Overview", false)}
      ${link("#browse", "Components", active === "browse")}
      ${link("#guide", "Guidelines", active === "guide")}
      ${link("#about", "About", false)}
    </nav>
    <p class="docs-rail-heading">Components</p>
    <nav class="docs-rail-group">
      ${link("#browse?type=rule", "Rules")}
      ${link("#browse?type=agent", "Agents")}
      ${link("#browse?type=skill", "Skills")}
      ${link("#browse?type=command", "Commands")}
      ${link("#browse?type=hook", "Hooks")}
    </nav>
  </aside>`;
}

function docsRightRail(active: "browse" | "guide"): string {
  if (active === "browse") {
    return ``;
  }
  return `<aside class="docs-right" aria-label="Guide links">
    <p class="docs-rail-heading">Guide</p>
    <nav class="docs-rail-group">
      <a class="docs-rail-link" href="#guide?id=01-intro">Introduction</a>
      <a class="docs-rail-link" href="#guide?id=02-rules">Rules</a>
      <a class="docs-rail-link" href="#guide?id=06-hooks">Hooks</a>
      <a class="docs-rail-link" href="#guide?id=12-models">Models</a>
    </nav>
  </aside>`;
}

function adoptionStripHtml(): string {
  return `<section class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" aria-labelledby="adopt-heading">
  <h2 id="adopt-heading" class="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">Start here (open source)</h2>
  <ol class="list-decimal space-y-1 pl-5">
    <li><strong>Fork or clone</strong> this repository, or use Cursor <strong>Settings → Add from GitHub</strong> for remote rules.</li>
    <li><strong>Pick what you need</strong> — copy only part of <code>.cursor/</code> (for example <code>.cursor/rules/</code>, one skill folder, or selected agents) into your project.</li>
    <li><strong>Align configuration</strong> — merge <code>.cursor/config/project.json</code> and resolve <code>{{CONFIG}}</code> placeholders for your stack (see README).</li>
  </ol>
  <p class="mt-3 text-xs">
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=01-intro">Guide intro</a> ·
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=02-rules">Rules guide</a> ·
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=03-skills">Skills guide</a>
  </p>
</section>`;
}

function guideReadFirstHtml(): string {
  return `<aside class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="region" aria-label="Read first">
  <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">Read first</h2>
  <ul class="list-disc space-y-1 pl-5">
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=01-intro">Introduction and orientation</a></li>
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=02-rules">Rules — vocabulary and UI</a> (this guide)</li>
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=06-hooks">Hooks and automation</a></li>
  </ul>
</aside>`;
}

function communityFooterHtml(): string {
  return `<p class="text-sm text-slate-600 dark:text-slate-300">Use the left navigation and guide chapters to explore everything directly in this UI.</p>`;
}

function cardHtml(c: Component): string {
  const short = (c.shortDescription && c.shortDescription.trim()) ||
    (c.description.length > 160 ? `${c.description.slice(0, 157).trim()}…` : c.description);
  const tags = (c.tags?.length ? c.tags : [c.type, c.category]).slice(0, 6);
  const tagsHtml = tags
    .map((t) =>
      `<span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">${escapeHtml(t)}</span>`
    )
    .join("");
  const inv = c.invocation
    ? `<p class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300" title="Invocation"><code>${escapeHtml(c.invocation)}</code></p>`
    : "";
  const typeIcon = TYPE_ICON_NAME[c.type] ? icon(TYPE_ICON_NAME[c.type]) : "";
  return `
    <article class="component-card type-${escapeHtml(c.type)} rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900" data-id="${escapeHtml(c.id)}">
      <div class="card-header mb-2">
        <span class="type-badge">${typeIcon}${escapeHtml(c.type)}</span>
        <h2 class="card-title text-lg font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</h2>
      </div>
      <div class="card-tags mb-2 flex flex-wrap gap-1.5" aria-label="Tags">${tagsHtml}</div>
      ${inv}
      <p class="card-description mt-2 text-base text-slate-600 dark:text-slate-300">${escapeHtml(short) || "—"}</p>
      <p class="card-path mt-2 break-all rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">${escapeHtml(c.path)}</p>
      <div class="card-actions mt-3 flex flex-wrap gap-2">
        <button type="button" class="copy-path inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" data-path="${escapeHtml(c.path)}">${icon("copy")}Copy path</button>
      </div>
    </article>
  `;
}

function browseSectionsHtml(list: Component[]): string {
  const grouped = groupForBrowse(list);
  return grouped
    .map(
      (sec) => `
      <section class="browse-section mt-8" aria-labelledby="browse-h-${escapeHtml(sec.typeKey)}">
        <h2 class="browse-section__title type-title type-${escapeHtml(sec.typeKey)} mb-4 inline-flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100" id="browse-h-${escapeHtml(sec.typeKey)}">${icon(TYPE_ICON_NAME[sec.typeKey] ?? "command")}${escapeHtml(sec.typeLabel)}</h2>
        ${Array.from(sec.byCategory.entries())
          .map(
            ([cat, items]) => `
          <div class="browse-subsection mb-6">
            <h3 class="browse-subsection__title mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">${escapeHtml(cat)} <span class="browse-subsection__count ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-700">${items.length}</span></h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              ${items.map((c) => cardHtml(c)).join("")}
            </div>
          </div>`,
          )
          .join("")}
      </section>`,
    )
    .join("");
}

function filteredComponents(payload: Payload, filters: BrowseFilters): Component[] {
  return payload.components.filter((c) => {
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.category !== "all" && c.category !== filters.category) return false;
    if (!matchesQuery(c, filters.q)) return false;
    return true;
  });
}

function renderBrowseResults(payload: Payload, filters: BrowseFilters): void {
  const list = filteredComponents(payload, filters);
  const cards = document.getElementById("cards");
  const stats = document.getElementById("browse-count");
  if (stats) {
    stats.innerHTML = `Showing <strong>${list.length}</strong> of ${payload.componentCount} components.`;
  }
  if (cards) {
    cards.innerHTML = list.length
      ? browseSectionsHtml(list)
      : `<p class="browse-empty rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">No components match. Clear filters or search.</p>`;
  }
}

export function normalizeBrowseFilters(
  payload: Payload,
  raw: BrowseFilters,
): BrowseFilters {
  const validTypes = new Set(["all", ...TYPE_ORDER]);
  const cats = new Set(uniqueCategories(payload.components));
  const category = raw.category === "all" || cats.has(raw.category) ? raw.category : "all";
  return {
    type: validTypes.has(raw.type) ? raw.type : "all",
    category,
    q: raw.q,
  };
}

export function pickSectionId(
  guide: GuidePayload,
  requested: string | undefined,
  filter: string,
): string | undefined {
  const filtered = guide.sections.filter((s) => matchesGuideSection(s, filter));
  if (!filtered.length) return undefined;
  if (requested && filtered.some((s) => s.id === requested)) return requested;
  return filtered[0].id;
}

export function renderBrowse(payload: Payload, filters: BrowseFilters): void {
  const app = document.getElementById("app");
  if (!app) return;
  const cats = uniqueCategories(payload.components);
  const ru = repoUrl();

  app.innerHTML = `
    <div class="layout ui-app w-full bg-slate-100 px-0 py-5 dark:bg-slate-950">
      <a class="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white" href="#main-content">Skip to content</a>
      <div id="ui-announce" class="sr-only" aria-live="polite"></div>
      ${topChrome("browse")}
      <div class="content-shell mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
      <div class="docs-layout">
      ${docsLeftRail("browse")}
      <main id="main-content" class="main-flow docs-main" tabindex="-1">
      <header id="overview" class="ui-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">cursor-handbook</h1>
        <p class="mt-2 text-slate-700 dark:text-slate-300">Reusable standards and workflows for Cursor-powered teams. Jump straight to components or guidelines.</p>
        <div class="header-actions mt-4 flex flex-wrap gap-2">
          <a class="btn btn-primary inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" href="#cards">${icon("compass")}Browse components</a>
          <a class="btn inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="#guide">${icon("book")}Read guidelines</a>
        </div>
      </header>
      <div id="repo-stats-browse"></div>
      ${adoptionStripHtml()}
      <div class="filters ui-panel mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        <div class="field">
          <label class="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="search">${icon("search")}Search</label>
          <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" type="search" id="search" placeholder="Name, path, description, role…" />
        </div>
        <div class="field">
          <label class="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="type">${icon("filter")}Component type</label>
          <select class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="type">
            ${TYPE_SELECT_OPTIONS.map((o) => `<option value="${o.value}" ${filters.type === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="category">${icon("folder")}Role / folder</label>
          <select class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="category">
            <option value="all">all</option>
            ${cats.map((c) => `<option value="${escapeHtml(c)}" ${filters.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
      </div>
      <p id="browse-count" class="stats mt-3 text-sm text-slate-600 dark:text-slate-300"></p>
      <section id="components">
        <div class="browse-groups" id="cards"></div>
      </section>
      <footer id="about" class="footer ui-panel mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p>Repository: <a href="${ru}" target="_blank" rel="noopener">${ru}</a> (${escapeHtml(currentSiteMeta().branch)})</p>
        <details class="mt-3">
          <summary class="cursor-pointer font-medium">Legal and attribution</summary>
          <div class="mt-2">${disclaimerStrip(true)}</div>
        </details>
        ${communityFooterHtml()}
      </footer>
      </main>
      ${docsRightRail("browse")}
      </div>
      </div>
    </div>
  `;

  syncThemeControlUi();
  renderBrowseResults(payload, filters);
  void hydrateRepoStats("repo-stats-browse");

  const search = document.getElementById("search") as HTMLInputElement | null;
  const typeSel = document.getElementById("type") as HTMLSelectElement | null;
  const catSel = document.getElementById("category") as HTMLSelectElement | null;
  if (search) search.value = filters.q;

  const bindFilters = () => {
    const next = {
      type: typeSel?.value ?? "all",
      category: catSel?.value ?? "all",
      q: search?.value ?? "",
    };
    renderBrowseResults(payload, next);
    replaceBrowseHash(next);
  };
  search?.addEventListener("input", debounce(bindFilters, 300));
  typeSel?.addEventListener("change", bindFilters);
  catSel?.addEventListener("change", bindFilters);
}

function hoistMermaidBlocks(root: HTMLElement): void {
  root.querySelectorAll("pre > code").forEach((code) => {
    const el = code as HTMLElement;
    if (!el.classList.contains("language-mermaid") && !el.className.includes("mermaid")) {
      return;
    }
    const pre = el.parentElement;
    if (!pre?.parentNode) return;
    const div = document.createElement("div");
    div.className = "mermaid my-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900";
    div.textContent = el.textContent ?? "";
    pre.replaceWith(div);
  });
}

async function runMermaidInGuide(): Promise<void> {
  const article = document.getElementById("guide-body");
  if (!article) return;
  hoistMermaidBlocks(article);
  const nodes = [...article.querySelectorAll<HTMLElement>(".mermaid")];
  if (!nodes.length) return;
  try {
    if (!mermaidApi) {
      const mod = await import("mermaid");
      mermaidApi = mod.default;
    }
    const mmTheme = document.documentElement.classList.contains("dark") ? "dark" : "default";
    mermaidApi.initialize({
      startOnLoad: false,
      theme: mmTheme,
      securityLevel: "strict",
      fontFamily: "system-ui, -apple-system, sans-serif",
    });
    await mermaidApi.run({ nodes });
  } catch {
    // invalid diagram or load failure
  }
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildGuideHeadingToc(): void {
  const article = document.getElementById("guide-body");
  const nav = document.getElementById("guide-headings");
  if (!article || !nav) return;
  const headings = Array.from(article.querySelectorAll<HTMLElement>("h2, h3"));
  if (!headings.length) {
    nav.innerHTML = "";
    return;
  }
  const usedIds = new Set<string>();
  headings.forEach((h, idx) => {
    const raw = h.id || slugifyHeading(h.textContent || `section-${idx + 1}`);
    let id = raw || `section-${idx + 1}`;
    let n = 2;
    while (usedIds.has(id)) {
      id = `${raw}-${n++}`;
    }
    usedIds.add(id);
    h.id = id;
  });
  nav.innerHTML = `<p class="guide-inline-toc-title">On this page</p><ol class="guide-inline-toc-list">${headings
    .map((h) => {
      const levelClass = h.tagName.toLowerCase() === "h3" ? "is-h3" : "is-h2";
      return `<li><a href="#${h.id}" class="guide-inline-toc-link ${levelClass}" data-heading-link="${h.id}">${escapeHtml(h.textContent || h.id)}</a></li>`;
    })
    .join("")}</ol>`;

  const linkById = new Map<string, HTMLAnchorElement>();
  nav.querySelectorAll<HTMLAnchorElement>("[data-heading-link]").forEach((a) => {
    const id = a.getAttribute("data-heading-link");
    if (id) linkById.set(id, a);
  });
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = (visible.target as HTMLElement).id;
      linkById.forEach((link, key) => {
        link.classList.toggle("is-active", key === id);
      });
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] },
  );
  headings.forEach((h) => observer.observe(h));
}

export function renderGuide(
  guide: GuidePayload,
  activeId: string | undefined,
  filter: string,
  onFilterChange: (nextFilter: string) => void,
): void {
  const app = document.getElementById("app");
  if (!app) return;

  const filtered = guide.sections.filter((s) => matchesGuideSection(s, filter));
  const active = (activeId && filtered.find((s) => s.id === activeId)) || filtered[0];
  const readMinutes = active ? estimateReadMinutes(active.markdown) : 0;
  const activeIdx = active ? filtered.findIndex((s) => s.id === active.id) : -1;
  const prev = activeIdx > 0 ? filtered[activeIdx - 1] : undefined;
  const nextChapter = activeIdx >= 0 && activeIdx < filtered.length - 1 ? filtered[activeIdx + 1] : undefined;
  const bodyHtml = active
    ? sanitizeHtmlFragment(marked.parse(active.markdown) as string)
    : "<p>No matching chapters. Clear the search filter.</p>";
  const tocItems = filtered
    .map((s) => {
      const cur = active?.id === s.id ? "!bg-slate-900 !text-white dark:!bg-slate-100 dark:!text-slate-900" : "";
      const href = `#guide?id=${encodeURIComponent(s.id)}`;
      return `<li><a class="toc__link block rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300 ${cur}" href="${href}">${escapeHtml(s.title)}</a></li>`;
    })
    .join("");

  app.innerHTML = `
    <div class="layout layout--wide ui-app w-full bg-slate-100 px-0 py-5 dark:bg-slate-950">
      <a class="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white" href="#main-content">Skip to content</a>
      <div id="ui-announce" class="sr-only" aria-live="polite"></div>
      ${topChrome("guide")}
      <div class="content-shell mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
      <div class="docs-layout docs-layout--guide">
      ${docsLeftRail("guide")}
      <main id="main-content" class="main-flow docs-main guide-main" tabindex="-1">
      <header id="overview" class="header header--guide ui-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">Cursor guidelines</h1>
        <p class="mt-2 text-slate-700 dark:text-slate-300">
          Rules (<code>globs</code>, <code>alwaysApply</code>), skills, agents, commands, hooks, models, sandbox, and migration from VS Code / IntelliJ.
          Always verify behavior in <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">official Cursor documentation</a>.
        </p>
        <div class="guide-meta mt-3 flex flex-wrap gap-2 text-xs">
          <span class="guide-chip">${icon("list")}${filtered.length} visible chapters</span>
          ${active ? `<span class="guide-chip">${icon("clock")}${readMinutes} min read</span>` : ""}
          ${filter.trim() ? `<span class="guide-chip">${icon("filter")}Filtered: ${escapeHtml(filter.trim())}</span>` : ""}
        </div>
        <div class="header-actions mt-4 flex flex-wrap gap-2">
          <a class="btn inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="#browse">${icon("compass")}Browse components</a>
          <a class="btn inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="#guide?id=01-intro">${icon("book")}Guide intro</a>
        </div>
      </header>
      <div id="repo-stats-guide"></div>
      ${guideReadFirstHtml()}
      <div class="guide-toolbar ui-panel mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label class="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="guide-filter">${icon("search")}Search guidelines</label>
        <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" type="search" id="guide-filter" placeholder="Filter by title or keyword…" />
      </div>
      <div class="guide-layout mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside class="guide-sidebar rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="guide-sidebar__title mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Chapters</h2>
          <ol class="toc space-y-1 text-sm">${tocItems}</ol>
        </aside>
        <article class="guide-content prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-5 dark:prose-invert dark:border-slate-800 dark:bg-slate-900" id="guide-body">${bodyHtml}
          <nav id="guide-headings" class="guide-inline-toc not-prose my-6 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60"></nav>
          <div class="guide-bottom-nav not-prose mt-8">
            ${prev ? `<a href="#guide?id=${encodeURIComponent(prev.id)}" class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">${icon("chevronLeft")}Previous</a>` : `<span></span>`}
            <a href="#main-content" class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">${icon("arrowUp")}Back to top</a>
            ${nextChapter ? `<a href="#guide?id=${encodeURIComponent(nextChapter.id)}" class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Next${icon("chevronRight")}</a>` : `<span></span>`}
          </div>
        </article>
      </div>
      <footer class="footer ui-panel mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <details class="mb-3">
          <summary class="cursor-pointer font-medium">Legal and attribution</summary>
          <div class="mt-2">${disclaimerStrip(false)}</div>
        </details>
        ${communityFooterHtml()}
        <p>Guide chapters are rendered from local handbook content in this UI.</p>
      </footer>
      </main>
      ${docsRightRail("guide")}
      </div>
      </div>
    </div>
  `;

  syncThemeControlUi();
  void hydrateRepoStats("repo-stats-guide");

  const input = document.getElementById("guide-filter") as HTMLInputElement | null;
  if (input) input.value = filter;
  input?.addEventListener(
    "input",
    debounce(() => {
      onFilterChange(input.value);
      const { sectionId } = parseHash();
      const next = pickSectionId(guide, sectionId, input.value);
      const filteredNext = guide.sections.filter((s) => matchesGuideSection(s, input.value));
      const keepCurrent = !!sectionId && filteredNext.some((s) => s.id === sectionId);
      if (!keepCurrent && next && next !== sectionId) {
        setGuideHash(next);
        return;
      }
      renderGuide(guide, keepCurrent ? sectionId : next, input.value, onFilterChange);
    }, 200),
  );

  void runMermaidInGuide();
  buildGuideHeadingToc();
}
