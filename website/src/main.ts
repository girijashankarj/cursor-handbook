import { marked } from "marked";

marked.setOptions({ gfm: true });

/** Lazy-loaded so the Browse view does not download Mermaid. */
let mermaidApi: typeof import("mermaid").default | null = null;

/** marked emits <pre><code class="language-mermaid">; Mermaid needs <div class="mermaid">. */
function hoistMermaidBlocks(root: HTMLElement): void {
  root.querySelectorAll("pre > code").forEach((code) => {
    const el = code as HTMLElement;
    if (
      !el.classList.contains("language-mermaid") &&
      !el.className.includes("mermaid")
    ) {
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
  if (nodes.length === 0) return;
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
    /* invalid diagram or load failure */
  }
}

const CURSOR_DOCS = "https://cursor.com/docs";
const CURSOR_RULES = "https://cursor.com/docs/rules";

/** Set by components.json / guide.json so forks don’t 404 on GitHub links. */
let siteRepo = "girijashankarj/cursor-handbook";
let siteBranch = "main";

function applySiteMeta(meta: { repo?: string; branch?: string } | undefined): void {
  if (meta?.repo) siteRepo = meta.repo;
  if (meta?.branch) siteBranch = meta.branch;
}

function repoUrl(): string {
  return `https://github.com/${siteRepo}`;
}

function issuesUrl(): string {
  return `${repoUrl()}/issues`;
}

function blobUrl(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, "");
  return `https://github.com/${siteRepo}/blob/${siteBranch}/${p}`;
}

function treeUrl(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://github.com/${siteRepo}/tree/${siteBranch}/${p}`;
}

let cachedRepoStats: RepoStats | null = null;
let cachedRepoStatsFor = "";

function formatCount(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "n/a";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function repoStatsHtml(stats: RepoStats | null, loading = false): string {
  if (loading) {
    return `<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-live="polite">Loading repository stats…</section>`;
  }
  if (!stats) return "";
  return `<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" aria-label="Repository stats">
    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Repository stats</p>
    <div class="flex flex-wrap gap-2">
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">Stars ${formatCount(stats.stars)}</span>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">Forks ${formatCount(stats.forks)}</span>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">Open issues ${formatCount(stats.openIssues)}</span>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">Watchers ${formatCount(stats.watchers)}</span>
    </div>
    <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Updated ${formatDate(stats.updatedAt)}</p>
  </section>`;
}

async function loadRepoStats(): Promise<RepoStats | null> {
  if (cachedRepoStats && cachedRepoStatsFor === siteRepo) return cachedRepoStats;
  try {
    const res = await fetch(`https://api.github.com/repos/${siteRepo}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const stats: RepoStats = {
      stars: Number(data.stargazers_count ?? 0),
      forks: Number(data.forks_count ?? 0),
      openIssues: Number(data.open_issues_count ?? 0),
      watchers: Number(data.subscribers_count ?? data.watchers_count ?? 0),
      updatedAt: String(data.updated_at ?? ""),
    };
    cachedRepoStats = stats;
    cachedRepoStatsFor = siteRepo;
    return stats;
  } catch {
    return null;
  }
}

async function hydrateRepoStats(containerId: string): Promise<void> {
  const host = document.getElementById(containerId);
  if (!host) return;
  host.innerHTML = repoStatsHtml(
    cachedRepoStatsFor === siteRepo ? cachedRepoStats : null,
    true,
  );
  const stats = await loadRepoStats();
  if (!host.isConnected) return;
  host.innerHTML = repoStatsHtml(stats);
}

interface Component {
  id: string;
  type: string;
  path: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  invocation: string;
  tags?: string[];
  githubUrl: string;
  rawUrl: string;
}

interface Payload {
  repo?: string;
  branch?: string;
  componentCount: number;
  components: Component[];
}

interface GuideSection {
  id: string;
  title: string;
  markdown: string;
}

interface GuidePayload {
  repo?: string;
  branch?: string;
  sectionCount: number;
  sections: GuideSection[];
}

interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  updatedAt: string;
}

let guideFilter = "";

const ASSET_BASE = import.meta.env.BASE_URL;
const THEME_STORAGE_KEY = "cursor-handbook-theme";

type ThemePreference = "system" | "light" | "dark";

function getThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* private mode */
  }
  return "system";
}

function setThemePreference(p: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, p);
  } catch {
    /* ignore */
  }
}

function resolveColorScheme(p: ThemePreference): "light" | "dark" {
  if (p === "light") return "light";
  if (p === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyColorScheme(): void {
  const pref = getThemePreference();
  const resolved = resolveColorScheme(pref);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  const meta = document.getElementById(
    "meta-theme-color",
  ) as HTMLMetaElement | null;
  if (meta)
    meta.setAttribute(
      "content",
      resolved === "light" ? "#f8fafc" : "#0f1419",
    );
  syncThemeControlUi();
}

function themePreferenceLabel(p: ThemePreference): string {
  if (p === "system") return "System";
  if (p === "light") return "Light";
  return "Dark";
}

function syncThemeControlUi(): void {
  const btn = document.querySelector(".theme-cycle") as HTMLButtonElement | null;
  if (!btn) return;
  const p = getThemePreference();
  const resolved = resolveColorScheme(p);
  const label = `Theme: ${themePreferenceLabel(p)}`;
  btn.setAttribute(
    "aria-label",
    `Color theme: ${themePreferenceLabel(p)} (${resolved} active). Click to change.`,
  );
  btn.setAttribute("title", label);
  const text = btn.querySelector(".theme-cycle__text");
  if (text) text.textContent = label;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface ParsedHash {
  view: "browse" | "guide";
  sectionId?: string;
  browse?: { type: string; category: string; q: string };
}

const VALID_BROWSE_TYPES = new Set([
  "all",
  "rule",
  "agent",
  "skill",
  "command",
  "hook",
]);

function parseHash(): ParsedHash {
  let raw = window.location.hash.replace(/^#/, "").trim();
  if (!raw) raw = "browse";
  const qIdx = raw.indexOf("?");
  const path = qIdx === -1 ? raw : raw.slice(0, qIdx);
  const qs = qIdx === -1 ? "" : raw.slice(qIdx + 1);
  const params = qs ? new URLSearchParams(qs) : new URLSearchParams();

  if (path === "guide") {
    return {
      view: "guide",
      sectionId: params.get("id") || undefined,
    };
  }

  if (path === "browse" || path === "") {
    const type = params.get("type") || "all";
    const category = params.get("category") || "all";
    const q = params.get("q") || "";
    return {
      view: "browse",
      browse: {
        type: VALID_BROWSE_TYPES.has(type) ? type : "all",
        category,
        q,
      },
    };
  }

  return { view: "browse", browse: { type: "all", category: "all", q: "" } };
}

function buildBrowseHash(filters: {
  type: string;
  category: string;
  q: string;
}): string {
  const params = new URLSearchParams();
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.q.trim()) params.set("q", filters.q.trim());
  const s = params.toString();
  return s ? `browse?${s}` : "browse";
}

/** Updates the address bar for shareable browse URLs without adding a history entry. */
function replaceBrowseHash(filters: {
  type: string;
  category: string;
  q: string;
}): void {
  const nextHash = `#${buildBrowseHash(filters)}`;
  if (window.location.hash === nextHash) return;
  const path = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", path);
}

function setGuideHash(sectionId: string): void {
  window.location.hash = `guide?id=${encodeURIComponent(sectionId)}`;
}

function normalize(s: string): string {
  return s.toLowerCase();
}

function matchesQuery(c: Component, q: string): boolean {
  if (!q.trim()) return true;
  const n = normalize(q);
  const tagHit =
    c.tags?.some((t) => normalize(t).includes(n)) ?? false;
  return (
    normalize(c.name).includes(n) ||
    normalize(c.description).includes(n) ||
    normalize(c.path).includes(n) ||
    normalize(c.category).includes(n) ||
    normalize(c.type).includes(n) ||
    tagHit ||
    (c.invocation && normalize(c.invocation).includes(n))
  );
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
    const sortedCats = Array.from(catMap.keys()).sort((a, b) =>
      a.localeCompare(b),
    );
    const ordered = new Map<string, Component[]>();
    for (const cat of sortedCats) ordered.set(cat, catMap.get(cat)!);
    out.push({
      typeKey,
      typeLabel: TYPE_LABEL[typeKey] ?? typeKey,
      byCategory: ordered,
    });
    byType.delete(typeKey);
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
    const sortedCats = Array.from(catMap.keys()).sort((a, b) =>
      a.localeCompare(b),
    );
    const ordered = new Map<string, Component[]>();
    for (const cat of sortedCats) ordered.set(cat, catMap.get(cat)!);
    out.push({
      typeKey,
      typeLabel: TYPE_LABEL[typeKey] ?? typeKey,
      byCategory: ordered,
    });
  }
  return out;
}

function matchesGuideSection(s: GuideSection, q: string): boolean {
  if (!q.trim()) return true;
  const n = normalize(q);
  return (
    normalize(s.title).includes(n) || normalize(s.markdown).includes(n)
  );
}

async function loadComponents(): Promise<Payload> {
  const url = `${import.meta.env.BASE_URL}components.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

async function loadGuide(): Promise<GuidePayload> {
  const url = `${import.meta.env.BASE_URL}guide.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

function disclaimerStrip(compact: boolean): string {
  const body = compact
    ? `<strong>cursor-handbook</strong> — independent of Cursor. <em>Cursor</em>, <em>Cursor IDE</em>, and official Cursor docs are <strong>Cursor / Anysphere rights</strong>. Not affiliated or endorsed. <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">cursor.com/docs</a> · <a href="${CURSOR_RULES}" target="_blank" rel="noopener">Rules</a>.`
    : `<p><strong>Cursor product rights.</strong> <em>Cursor</em>, <em>Cursor IDE</em>, logos, user interface, and official documentation are <strong>intellectual property of Cursor and its licensors</strong> (e.g. Anysphere, Inc.). All such rights remain with their owners. This <strong>cursor-handbook</strong> site and repository are <strong>community-maintained</strong> and <strong>not affiliated, endorsed, or sponsored</strong> by Cursor.</p>
       <p>For authoritative behavior (<code>globs</code>, <code>alwaysApply</code>, hooks, sandbox, models), use <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">cursor.com/docs</a> — especially <a href="${CURSOR_RULES}" target="_blank" rel="noopener">cursor.com/docs/rules</a>.</p>`;
  return `<aside class="rounded-xl border border-slate-300 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-900/60 ${compact ? "py-2 text-xs" : "py-3 text-sm"} text-slate-700 dark:text-slate-300" role="note">${body}</aside>`;
}

function siteNav(active: "browse" | "guide"): string {
  const base =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors";
  const activeCls =
    "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900";
  const idleCls =
    "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  const b =
    active === "browse"
      ? `<span class="${base} ${activeCls}">Browse</span>`
      : `<a class="${base} ${idleCls}" href="#browse">Browse</a>`;
  const g =
    active === "guide"
      ? `<span class="${base} ${activeCls}">Guidelines</span>`
      : `<a class="${base} ${idleCls}" href="#guide">Guidelines</a>`;
  return `<nav class="flex items-center gap-2" aria-label="Main">${b} ${g}</nav>`;
}

function themeControlHtml(): string {
  return `<button type="button" class="theme-cycle inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Color theme" title="Theme">
    <span class="theme-cycle__text">Theme</span>
  </button>`;
}

function topChrome(active: "browse" | "guide"): string {
  return `<div class="sticky top-0 z-40 mb-4 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-5">
  <div class="flex flex-wrap items-center gap-3 sm:gap-4">
    <a class="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-base font-bold text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800" href="#browse" aria-label="Home — cursor-handbook">
      <img class="h-8 w-8 rounded-lg" src="${ASSET_BASE}favicon.svg" width="32" height="32" alt="" decoding="async" />
      <span class="text-slate-900 dark:text-white">cursor-handbook</span>
    </a>
    <div class="order-3 w-full sm:order-2 sm:w-auto">${siteNav(active)}</div>
    <div class="ml-auto order-2 sm:order-3">${themeControlHtml()}</div>
  </div>
</div>`;
}

function uniqueCategories(components: Component[]): string[] {
  const s = new Set(components.map((c) => c.category));
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

function normalizeBrowseFilters(
  payload: Payload,
  raw: { type: string; category: string; q: string },
): { type: string; category: string; q: string } {
  const cats = new Set(uniqueCategories(payload.components));
  const category =
    raw.category === "all" || cats.has(raw.category) ? raw.category : "all";
  return {
    type: VALID_BROWSE_TYPES.has(raw.type) ? raw.type : "all",
    category,
    q: raw.q,
  };
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
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("README.md")}">README</a> ·
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("docs/getting-started/quick-start.md")}">Quick start</a> ·
    <a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("docs/getting-started/configuration.md")}">Configuration</a>
  </p>
</section>`;
}

function guideReadFirstHtml(): string {
  return `<aside class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="region" aria-label="Read first">
  <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">Read first</h2>
  <ul class="list-disc space-y-1 pl-5">
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("docs/getting-started/non-technical.md")}" target="_blank" rel="noopener">Non-technical getting started</a> (GitHub)</li>
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="#guide?id=02-rules">Rules — vocabulary and UI</a> (this guide)</li>
    <li><a class="font-medium text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("docs/reference/cursor-recognized-files.md")}" target="_blank" rel="noopener">Cursor-recognized files</a> (GitHub)</li>
  </ul>
</aside>`;
}

function communityFooterHtml(): string {
  return `<p class="text-sm text-slate-600 dark:text-slate-300">
  <a class="text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("LICENSE")}" target="_blank" rel="noopener">License</a>
  · <a class="text-sky-700 hover:underline dark:text-sky-300" href="${blobUrl("CONTRIBUTING.md")}" target="_blank" rel="noopener">Contributing</a>
  · <a class="text-sky-700 hover:underline dark:text-sky-300" href="${issuesUrl()}" target="_blank" rel="noopener">Issues</a>
</p>`;
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function pickSectionId(
  guide: GuidePayload,
  requested: string | undefined,
  filter: string,
): string | undefined {
  const filtered = guide.sections.filter((s) => matchesGuideSection(s, filter));
  if (!filtered.length) return undefined;
  if (requested && filtered.some((s) => s.id === requested))
    return requested;
  return filtered[0].id;
}

function renderBrowse(
  payload: Payload,
  filters: { type: string; category: string; q: string },
): void {
  const app = document.getElementById("app");
  if (!app) return;

  applySiteMeta(payload);

  const list = payload.components.filter((c) => {
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.category !== "all" && c.category !== filters.category)
      return false;
    if (!matchesQuery(c, filters.q)) return false;
    return true;
  });

  const cats = uniqueCategories(payload.components);
  const grouped = groupForBrowse(list);
  const sectionsHtml = grouped
    .map(
      (sec) => `
      <section class="browse-section mt-8" aria-labelledby="browse-h-${escapeHtml(sec.typeKey)}">
        <h2 class="browse-section__title mb-4 text-xl font-bold text-slate-900 dark:text-slate-100" id="browse-h-${escapeHtml(sec.typeKey)}">${escapeHtml(sec.typeLabel)}</h2>
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

  const ru = repoUrl();
  app.innerHTML = `
    <div class="layout w-full bg-slate-100 px-0 py-5 dark:bg-slate-950">
      <a class="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white" href="#main-content">Skip to content</a>
      ${topChrome("browse")}
      ${disclaimerStrip(true)}
      <main id="main-content" class="main-flow" tabindex="-1">
      <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">cursor-handbook</h1>
        <p class="mt-2 text-slate-700 dark:text-slate-300">
          Browse rules, agents, skills, commands, and hooks for
          <strong>Cursor IDE</strong>. Using this handbook is <strong>optional</strong> — use
          Cursor Settings → Add from GitHub, clone the repo, or the command line.
        </p>
        <div class="header-actions mt-4 flex flex-wrap gap-2">
          <a class="btn btn-primary inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" href="${ru}" target="_blank" rel="noopener">View repository</a>
          <a class="btn inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="#guide">Cursor guidelines</a>
          <a class="btn inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="${blobUrl("docs/getting-started/non-technical.md")}" target="_blank" rel="noopener">Non-technical guide</a>
        </div>
        <p class="header-hint mt-3 text-sm text-slate-600 dark:text-slate-300">Copy one file at a time: use <strong>Download file</strong> on a card (same as Raw), or open <strong>View on GitHub</strong> and use GitHub’s download / raw view.</p>
      </header>
      <div id="repo-stats-browse"></div>

      ${adoptionStripHtml()}

      <div class="notice mt-4 rounded-2xl border border-emerald-300/40 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
        <strong>Not a mandatory step.</strong>
        You can enable Cursor for your project without copying any files from this repo.
        The <a href="${blobUrl("README.md")}" target="_blank" rel="noopener">README</a>
        describes clone, copy, and &quot;Add from GitHub&quot; workflows.
      </div>

      <div class="filters mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        <div class="field">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="search">Search</label>
          <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" type="search" id="search" placeholder="Name, path, description, role…" />
        </div>
        <div class="field">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="type">Component type</label>
          <select class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="type">
            ${TYPE_SELECT_OPTIONS.map(
              (o) =>
                `<option value="${o.value}" ${filters.type === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`,
            ).join("")}
          </select>
        </div>
        <div class="field">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="category">Role / folder</label>
          <select class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="category">
            <option value="all">all</option>
            ${cats.map((c) => `<option value="${escapeHtml(c)}" ${filters.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
      </div>

      <p class="stats mt-3 text-sm text-slate-600 dark:text-slate-300">Showing <strong>${list.length}</strong> of ${payload.componentCount} components.</p>

      <div class="browse-groups" id="cards">
        ${list.length ? sectionsHtml : `<p class="browse-empty rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">No components match. Clear filters or search.</p>`}
      </div>

      <footer class="footer mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p>Repository: <a href="${ru}" target="_blank" rel="noopener">${ru}</a> (${escapeHtml(siteBranch)})</p>
        ${communityFooterHtml()}
        <p>More documentation:</p>
        <ul>
          <li><a href="${blobUrl("docs/cursor-guidelines/README.md")}" target="_blank" rel="noopener">Cursor guidelines (source)</a></li>
          <li><a href="${blobUrl("docs/reference/sdlc-role-map.md")}" target="_blank" rel="noopener">SDLC role map</a></li>
          <li><a href="${blobUrl("docs/reference/cursor-recognized-files.md")}" target="_blank" rel="noopener">Cursor-recognized files</a></li>
          <li><a href="${blobUrl("COMPONENT_INDEX.md")}" target="_blank" rel="noopener">Component index</a></li>
        </ul>
        <p class="footer-share mt-2 text-xs text-slate-500 dark:text-slate-400">Share filtered browse: copy the URL from the address bar (for example <code>#browse?type=skill</code>).</p>
      </footer>
      </main>
    </div>
  `;

  syncThemeControlUi();
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
    renderBrowse(payload, next);
    replaceBrowseHash(next);
  };
  search?.addEventListener("input", debounce(bindFilters, 300));
  typeSel?.addEventListener("change", bindFilters);
  catSel?.addEventListener("change", bindFilters);
}

function cardHtml(c: Component): string {
  const short =
    (c.shortDescription && c.shortDescription.trim()) ||
    (c.description.length > 160
      ? `${c.description.slice(0, 157).trim()}…`
      : c.description);
  const tags = (c.tags?.length ? c.tags : [c.type, c.category]).slice(0, 6);
  const tagsHtml = tags
    .map(
      (t) =>
        `<span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">${escapeHtml(t)}</span>`,
    )
    .join("");
  const inv = c.invocation
    ? `<p class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300" title="Invocation"><code>${escapeHtml(c.invocation)}</code></p>`
    : "";
  return `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900" data-id="${escapeHtml(c.id)}">
      <div class="mb-2 flex items-start justify-between gap-3">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</h2>
      </div>
      <div class="mb-2 flex flex-wrap gap-1.5" aria-label="Tags">${tagsHtml}</div>
      ${inv}
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(short) || "—"}</p>
      <p class="mt-2 break-all rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">${escapeHtml(c.path)}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <a class="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" href="${escapeHtml(c.githubUrl)}" target="_blank" rel="noopener">View on GitHub</a>
        <a class="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" href="${escapeHtml(c.rawUrl)}" target="_blank" rel="noopener">Download file</a>
        <button type="button" class="copy-path inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" data-path="${escapeHtml(c.path)}">Copy path</button>
      </div>
    </article>
  `;
}

function renderGuide(
  guide: GuidePayload,
  activeId: string | undefined,
  filter: string,
): void {
  const app = document.getElementById("app");
  if (!app) return;

  applySiteMeta(guide);

  const filtered = guide.sections.filter((s) => matchesGuideSection(s, filter));
  const active =
    (activeId && filtered.find((s) => s.id === activeId)) || filtered[0];

  const bodyHtml = active
    ? (marked.parse(active.markdown) as string)
    : "<p>No matching chapters. Clear the search filter.</p>";

  const tocItems = filtered
    .map((s) => {
      const cur = active?.id === s.id ? "!bg-slate-900 !text-white dark:!bg-slate-100 dark:!text-slate-900" : "";
      const href = `#guide?id=${encodeURIComponent(s.id)}`;
      return `<li><a class="toc__link block rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300 ${cur}" href="${href}">${escapeHtml(s.title)}</a></li>`;
    })
    .join("");

  app.innerHTML = `
    <div class="layout layout--wide w-full bg-slate-100 px-0 py-5 dark:bg-slate-950">
      <a class="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white" href="#main-content">Skip to content</a>
      ${topChrome("guide")}
      ${disclaimerStrip(false)}
      <main id="main-content" class="main-flow" tabindex="-1">
      <header class="header header--guide rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">Cursor guidelines</h1>
        <p class="header-eyebrow mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">cursor-handbook · deep orientation + vocabulary</p>
        <p class="mt-2 text-slate-700 dark:text-slate-300">
          Rules (<code>globs</code>, <code>alwaysApply</code>), skills, agents, commands, hooks, models, sandbox, and migration from VS Code / IntelliJ — with links to official Cursor docs.
          Always verify behavior in <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">official Cursor documentation</a>
          (e.g. <a href="${CURSOR_RULES}" target="_blank" rel="noopener">Rules</a>).
        </p>
        <div class="header-actions mt-4 flex flex-wrap gap-2">
          <a class="btn btn-primary inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" href="${blobUrl("docs/cursor-guidelines/README.md")}" target="_blank" rel="noopener">Source on GitHub</a>
          <a class="btn inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" href="#browse">Browse components</a>
        </div>
      </header>
      <div id="repo-stats-guide"></div>

      ${guideReadFirstHtml()}

      <div class="guide-toolbar mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="field field--grow">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="guide-filter">Search guidelines</label>
          <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" type="search" id="guide-filter" placeholder="Filter by title or keyword…" />
        </div>
      </div>

      <div class="guide-layout mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside class="guide-sidebar rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="guide-sidebar__title mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Chapters</h2>
          <ol class="toc space-y-1 text-sm">${tocItems}</ol>
        </aside>
        <article class="guide-content prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-5 dark:prose-invert dark:border-slate-800 dark:bg-slate-900" id="guide-body">
          ${bodyHtml}
        </article>
      </div>

      <footer class="footer mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        ${communityFooterHtml()}
        <p>Markdown source: <a href="${treeUrl("docs/cursor-guidelines")}" target="_blank" rel="noopener">docs/cursor-guidelines/</a> · branch <code>${escapeHtml(siteBranch)}</code></p>
      </footer>
      </main>
    </div>
  `;

  syncThemeControlUi();
  void hydrateRepoStats("repo-stats-guide");
  const input = document.getElementById("guide-filter") as HTMLInputElement | null;
  if (input) input.value = filter;

  input?.addEventListener(
    "input",
    debounce(() => {
      guideFilter = input.value;
      const { sectionId } = parseHash();
      const g = cachedGuide;
      if (!g) return;
      const next = pickSectionId(g, sectionId, guideFilter);
      if (next && next !== sectionId) setGuideHash(next);
      else renderGuide(g, next, guideFilter);
    }, 200),
  );

  void runMermaidInGuide();
}

let cachedComponents: Payload | null = null;
let cachedGuide: GuidePayload | null = null;

function refreshViewAfterThemeChange(): void {
  const { view, sectionId } = parseHash();
  if (view === "guide" && cachedGuide) {
    const activeId = pickSectionId(cachedGuide, sectionId, guideFilter);
    renderGuide(cachedGuide, activeId, guideFilter);
    return;
  }
  if (view === "browse" && cachedComponents) {
    const raw = parseHash().browse ?? { type: "all", category: "all", q: "" };
    const filters = normalizeBrowseFilters(cachedComponents, raw);
    renderBrowse(cachedComponents, filters);
  }
}

function cycleThemePreference(): void {
  const order: ThemePreference[] = ["system", "light", "dark"];
  const cur = getThemePreference();
  const i = order.indexOf(cur);
  const next = order[(i + 1) % order.length]!;
  setThemePreference(next);
  applyColorScheme();
  refreshViewAfterThemeChange();
}

function initTheme(): void {
  applyColorScheme();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getThemePreference() !== "system") return;
      applyColorScheme();
      refreshViewAfterThemeChange();
    });
}

async function route(): Promise<void> {
  const parsed = parseHash();

  try {
    if (parsed.view === "guide") {
      if (!cachedGuide) cachedGuide = await loadGuide();
      const activeId = pickSectionId(
        cachedGuide,
        parsed.sectionId,
        guideFilter,
      );
      if (activeId && activeId !== parsed.sectionId) {
        setGuideHash(activeId);
        return;
      }
      renderGuide(cachedGuide, activeId, guideFilter);
      return;
    }

    if (!cachedComponents) cachedComponents = await loadComponents();
    const raw = parsed.browse ?? { type: "all", category: "all", q: "" };
    const filters = normalizeBrowseFilters(cachedComponents, raw);
    renderBrowse(cachedComponents, filters);
  } catch (err) {
    const app = document.getElementById("app");
    const { view } = parseHash();
    if (app) {
      app.innerHTML = `<div class="layout w-full px-0 py-5">
        <a class="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white" href="#main-content">Skip to content</a>
        ${topChrome(view === "guide" ? "guide" : "browse")}
        <main id="main-content" class="main-flow" tabindex="-1">
          <p class="error rounded-xl border border-rose-300/40 bg-rose-50 p-4 text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-300">${escapeHtml(String(err))}</p>
        </main>
      </div>`;
      syncThemeControlUi();
    }
  }
}

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest(".theme-cycle")) {
    e.preventDefault();
    cycleThemePreference();
    return;
  }
  if (t.classList.contains("copy-path")) {
    const path = t.getAttribute("data-path");
    if (path) void navigator.clipboard.writeText(path);
  }
});

window.addEventListener("hashchange", () => {
  void route();
});

initTheme();
void route();
