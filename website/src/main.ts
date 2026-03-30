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
    div.className = "mermaid";
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
    const mmTheme =
      document.documentElement.dataset.colorScheme === "light"
        ? "default"
        : "dark";
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
  document.documentElement.dataset.colorScheme = resolved;
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
  const btn = document.querySelector(".theme-cycle");
  if (!btn) return;
  const p = getThemePreference();
  const resolved = resolveColorScheme(p);
  btn.setAttribute("data-preference", p);
  btn.setAttribute(
    "aria-label",
    `Color theme: ${themePreferenceLabel(p)} (${resolved === "light" ? "light" : "dark"} active). Click to change.`,
  );
  btn.setAttribute("title", `Theme: ${themePreferenceLabel(p)}`);
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
  return `<aside class="disclaimer ${compact ? "disclaimer--compact" : ""}" role="note">${body}</aside>`;
}

function siteNav(active: "browse" | "guide"): string {
  const b =
    active === "browse"
      ? '<span class="nav-link nav-link--active">Browse</span>'
      : '<a class="nav-link" href="#browse">Browse</a>';
  const g =
    active === "guide"
      ? '<span class="nav-link nav-link--active">Guidelines</span>'
      : '<a class="nav-link" href="#guide">Guidelines</a>';
  return `<nav class="site-nav" aria-label="Main">${b} ${g}</nav>`;
}

function themeControlHtml(): string {
  return `<button type="button" class="theme-cycle btn btn--icon" aria-label="Color theme" title="Theme">
  <span class="theme-cycle__icons" aria-hidden="true">
    <svg class="theme-cycle__svg theme-cycle__svg--system" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    <svg class="theme-cycle__svg theme-cycle__svg--sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    <svg class="theme-cycle__svg theme-cycle__svg--moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </span>
</button>`;
}

function topChrome(active: "browse" | "guide"): string {
  return `<div class="top-bar">
  <div class="top-bar__start">
    <a class="brand" href="#browse" aria-label="Home — cursor-handbook">
      <img class="brand__mark" src="${ASSET_BASE}favicon.svg" width="32" height="32" alt="" decoding="async" />
      <span class="brand__text">cursor-handbook</span>
    </a>
  </div>
  ${siteNav(active)}
  <div class="top-bar__end">${themeControlHtml()}</div>
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
  return `<section class="adoption-strip" aria-labelledby="adopt-heading">
  <h2 id="adopt-heading" class="adoption-strip__title">Start here (open source)</h2>
  <ol class="adoption-strip__steps">
    <li><strong>Fork or clone</strong> this repository, or use Cursor <strong>Settings → Add from GitHub</strong> for remote rules.</li>
    <li><strong>Pick what you need</strong> — copy only part of <code>.cursor/</code> (for example <code>.cursor/rules/</code>, one skill folder, or selected agents) into your project.</li>
    <li><strong>Align configuration</strong> — merge <code>.cursor/config/project.json</code> and resolve <code>{{CONFIG}}</code> placeholders for your stack (see README).</li>
  </ol>
  <p class="adoption-strip__paths">
    <a href="${blobUrl("README.md")}">README</a> ·
    <a href="${blobUrl("docs/getting-started/quick-start.md")}">Quick start</a> ·
    <a href="${blobUrl("docs/getting-started/configuration.md")}">Configuration</a>
  </p>
</section>`;
}

function guideReadFirstHtml(): string {
  return `<aside class="guide-read-first" role="region" aria-label="Read first">
  <h2 class="guide-read-first__title">Read first</h2>
  <ul class="guide-read-first__list">
    <li><a href="${blobUrl("docs/getting-started/non-technical.md")}" target="_blank" rel="noopener">Non-technical getting started</a> (GitHub)</li>
    <li><a href="#guide?id=02-rules">Rules — vocabulary and UI</a> (this guide)</li>
    <li><a href="${blobUrl("docs/reference/cursor-recognized-files.md")}" target="_blank" rel="noopener">Cursor-recognized files</a> (GitHub)</li>
  </ul>
</aside>`;
}

function communityFooterHtml(): string {
  return `<p class="footer-community">
  <a href="${blobUrl("LICENSE")}" target="_blank" rel="noopener">License</a>
  · <a href="${blobUrl("CONTRIBUTING.md")}" target="_blank" rel="noopener">Contributing</a>
  · <a href="${issuesUrl()}" target="_blank" rel="noopener">Issues</a>
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
      <section class="browse-section" aria-labelledby="browse-h-${escapeHtml(sec.typeKey)}">
        <h2 class="browse-section__title" id="browse-h-${escapeHtml(sec.typeKey)}">${escapeHtml(sec.typeLabel)}</h2>
        ${Array.from(sec.byCategory.entries())
          .map(
            ([cat, items]) => `
          <div class="browse-subsection">
            <h3 class="browse-subsection__title">${escapeHtml(cat)} <span class="browse-subsection__count">${items.length}</span></h3>
            <div class="grid">
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
    <div class="layout">
      <a class="skip-link" href="#main-content">Skip to content</a>
      ${topChrome("browse")}
      ${disclaimerStrip(true)}
      <main id="main-content" class="main-flow" tabindex="-1">
      <header class="header">
        <h1>cursor-handbook</h1>
        <p>
          Browse rules, agents, skills, commands, and hooks for
          <strong>Cursor IDE</strong>. Using this handbook is <strong>optional</strong> — use
          Cursor Settings → Add from GitHub, clone the repo, or the command line.
        </p>
        <div class="header-actions">
          <a class="btn btn-primary" href="${ru}" target="_blank" rel="noopener">View repository</a>
          <a class="btn" href="#guide">Cursor guidelines</a>
          <a class="btn" href="${blobUrl("docs/getting-started/non-technical.md")}" target="_blank" rel="noopener">Non-technical guide</a>
        </div>
        <p class="header-hint">Copy one file at a time: use <strong>Download file</strong> on a card (same as Raw), or open <strong>View on GitHub</strong> and use GitHub’s download / raw view.</p>
      </header>

      ${adoptionStripHtml()}

      <div class="notice">
        <strong>Not a mandatory step.</strong>
        You can enable Cursor for your project without copying any files from this repo.
        The <a href="${blobUrl("README.md")}" target="_blank" rel="noopener">README</a>
        describes clone, copy, and &quot;Add from GitHub&quot; workflows.
      </div>

      <div class="filters">
        <div class="field">
          <label for="search">Search</label>
          <input type="search" id="search" placeholder="Name, path, description, role…" />
        </div>
        <div class="field">
          <label for="type">Component type</label>
          <select id="type">
            ${TYPE_SELECT_OPTIONS.map(
              (o) =>
                `<option value="${o.value}" ${filters.type === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`,
            ).join("")}
          </select>
        </div>
        <div class="field">
          <label for="category">Role / folder</label>
          <select id="category">
            <option value="all">all</option>
            ${cats.map((c) => `<option value="${escapeHtml(c)}" ${filters.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
      </div>

      <p class="stats">Showing <strong>${list.length}</strong> of ${payload.componentCount} components.</p>

      <div class="browse-groups" id="cards">
        ${list.length ? sectionsHtml : `<p class="browse-empty">No components match. Clear filters or search.</p>`}
      </div>

      <footer class="footer">
        <p>Repository: <a href="${ru}" target="_blank" rel="noopener">${ru}</a> (${escapeHtml(siteBranch)})</p>
        ${communityFooterHtml()}
        <p>More documentation:</p>
        <ul>
          <li><a href="${blobUrl("docs/cursor-guidelines/README.md")}" target="_blank" rel="noopener">Cursor guidelines (source)</a></li>
          <li><a href="${blobUrl("docs/reference/sdlc-role-map.md")}" target="_blank" rel="noopener">SDLC role map</a></li>
          <li><a href="${blobUrl("docs/reference/cursor-recognized-files.md")}" target="_blank" rel="noopener">Cursor-recognized files</a></li>
          <li><a href="${blobUrl("COMPONENT_INDEX.md")}" target="_blank" rel="noopener">Component index</a></li>
        </ul>
        <p class="footer-share">Share filtered browse: copy the URL from the address bar (for example <code>#browse?type=skill</code>).</p>
      </footer>
      </main>
    </div>
  `;

  syncThemeControlUi();
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
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");
  const inv = c.invocation
    ? `<p class="card-invocation" title="Invocation"><code>${escapeHtml(c.invocation)}</code></p>`
    : "";
  return `
    <article class="card" data-id="${escapeHtml(c.id)}">
      <div class="card-header">
        <h2 class="card-title">${escapeHtml(c.name)}</h2>
      </div>
      <div class="card-tags" aria-label="Tags">${tagsHtml}</div>
      ${inv}
      <p class="card-desc">${escapeHtml(short) || "—"}</p>
      <p class="card-path">${escapeHtml(c.path)}</p>
      <div class="card-actions">
        <a class="btn" href="${escapeHtml(c.githubUrl)}" target="_blank" rel="noopener">View on GitHub</a>
        <a class="btn btn-primary" href="${escapeHtml(c.rawUrl)}" target="_blank" rel="noopener">Download file</a>
        <button type="button" class="btn copy-path" data-path="${escapeHtml(c.path)}">Copy path</button>
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
      const cur = active?.id === s.id ? "toc__link--active" : "";
      const href = `#guide?id=${encodeURIComponent(s.id)}`;
      return `<li><a class="toc__link ${cur}" href="${href}">${escapeHtml(s.title)}</a></li>`;
    })
    .join("");

  app.innerHTML = `
    <div class="layout layout--wide">
      <a class="skip-link" href="#main-content">Skip to content</a>
      ${topChrome("guide")}
      ${disclaimerStrip(false)}
      <main id="main-content" class="main-flow" tabindex="-1">
      <header class="header header--guide">
        <h1>Cursor guidelines</h1>
        <p class="header-eyebrow">cursor-handbook · deep orientation + vocabulary</p>
        <p>
          Rules (<code>globs</code>, <code>alwaysApply</code>), skills, agents, commands, hooks, models, sandbox, and migration from VS Code / IntelliJ — with links to official Cursor docs.
          Always verify behavior in <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">official Cursor documentation</a>
          (e.g. <a href="${CURSOR_RULES}" target="_blank" rel="noopener">Rules</a>).
        </p>
        <div class="header-actions">
          <a class="btn btn-primary" href="${blobUrl("docs/cursor-guidelines/README.md")}" target="_blank" rel="noopener">Source on GitHub</a>
          <a class="btn" href="#browse">Browse components</a>
        </div>
      </header>

      ${guideReadFirstHtml()}

      <div class="guide-toolbar">
        <div class="field field--grow">
          <label for="guide-filter">Search guidelines</label>
          <input type="search" id="guide-filter" placeholder="Filter by title or keyword…" />
        </div>
      </div>

      <div class="guide-layout">
        <aside class="guide-sidebar">
          <h2 class="guide-sidebar__title">Chapters</h2>
          <ol class="toc">${tocItems}</ol>
        </aside>
        <article class="guide-content prose" id="guide-body">
          ${bodyHtml}
        </article>
      </div>

      <footer class="footer">
        ${communityFooterHtml()}
        <p>Markdown source: <a href="${treeUrl("docs/cursor-guidelines")}" target="_blank" rel="noopener">docs/cursor-guidelines/</a> · branch <code>${escapeHtml(siteBranch)}</code></p>
      </footer>
      </main>
    </div>
  `;

  syncThemeControlUi();
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
      app.innerHTML = `<div class="layout">
        <a class="skip-link" href="#main-content">Skip to content</a>
        ${topChrome(view === "guide" ? "guide" : "browse")}
        <main id="main-content" class="main-flow" tabindex="-1">
          <p class="error">${escapeHtml(String(err))}</p>
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
