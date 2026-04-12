import { marked } from "marked";
import { currentSiteMeta, fetchRawContent, hydrateRepoStats, repoUrl } from "./services";
import { parseHash, replaceBrowseHash, setGuideHash } from "./router";
import { syncThemeControlUi } from "./theme";
import type { BrowseFilters, Component, GuidePayload, GuideSection, Payload } from "./types";
import { announce, copyWithFeedback, debounce, ensureExternalLinksOpenInNewTab, escapeHtml, sanitizeHtmlFragment } from "./ui";

marked.setOptions({ gfm: true });
let mermaidApi: typeof import("mermaid").default | null = null;
const CURSOR_DOCS = "https://cursor.com/docs";
const ASSET_BASE = import.meta.env.BASE_URL;

function icon(name: "search" | "filter" | "folder" | "copy"): string {
  const common = `class="ui-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"`;
  if (name === "search") return `<svg ${common}><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4 4"/></svg>`;
  if (name === "filter") return `<svg ${common}><path d="M3 5h14M6 10h8M8 15h4"/></svg>`;
  if (name === "folder") return `<svg ${common}><path d="M2.5 6.5h5l1.8 2h7.2v7.5H2.5z"/></svg>`;
  return `<svg ${common}><rect x="7" y="7" width="9" height="9" rx="1.5"/><rect x="4" y="4" width="9" height="9" rx="1.5"/></svg>`;
}

const TYPE_ICON_NAME: Record<string, string> = {
  rule: "Rule",
  agent: "Agent",
  skill: "Skill",
  command: "Command",
  hook: "Hook",
};

const TAG_SVG_COMMON =
  `class="card-tag__svg" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;

/** Mini icons aligned with type badges — folder for category / other tags. */
function tagSvgForLabel(tag: string): string {
  const n = normalize(tag);
  if (n === "rule") {
    return `<svg ${TAG_SVG_COMMON}><path d="M4 4.5h12v11H4z"/><path d="M7 8h6M7 11h6"/></svg>`;
  }
  if (n === "agent") {
    return `<svg ${TAG_SVG_COMMON}><circle cx="10" cy="7" r="2.5"/><path d="M5.5 15.5a4.5 4.5 0 0 1 9 0"/></svg>`;
  }
  if (n === "skill") {
    return `<svg ${TAG_SVG_COMMON}><path d="M10 3.5 12 7l3.8.6-2.7 2.6.7 3.8-3.8-2-3.8 2 .7-3.8-2.7-2.6L8 7z"/></svg>`;
  }
  if (n === "command") {
    return `<svg ${TAG_SVG_COMMON}><path d="M3.5 6h13M3.5 10h8M3.5 14h13"/></svg>`;
  }
  if (n === "hook") {
    return `<svg ${TAG_SVG_COMMON}><path d="M13 6a3 3 0 1 0-3 3h1a2.5 2.5 0 1 1-2.5 2.5"/></svg>`;
  }
  return `<svg ${TAG_SVG_COMMON}><path d="M2.5 6.5h5l1.8 2h7.2v7.5H2.5z"/></svg>`;
}

function tagChipClass(tag: string): string {
  const n = normalize(tag);
  if (TYPE_ORDER.includes(n as (typeof TYPE_ORDER)[number])) return `card-tag card-tag--${n}`;
  return "card-tag card-tag--category";
}

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

function appShell(active: "home" | "setup" | "browse" | "guide", content: string): string {
  const repo = repoUrl();
  const branch = currentSiteMeta().branch;
  return `<div class="app-shell">
    <header class="app-topbar">
      <a class="app-logo" href="#home" aria-label="cursor-handbook home">
        <img src="${ASSET_BASE}favicon.svg" width="26" height="26" alt="" />
        <span>cursor-handbook</span>
      </a>
      <nav class="app-nav" aria-label="Primary">
        <a href="#home" class="${active === "home" ? "is-active" : ""}">Home</a>
        <a href="#setup" class="${active === "setup" ? "is-active" : ""}">Get Started</a>
        <a href="#browse" class="${active === "browse" ? "is-active" : ""}">Browse</a>
        <a href="#guide" class="${active === "guide" ? "is-active" : ""}">Guidelines</a>
        <a href="${repo}" target="_blank" rel="noopener">Repo</a>
      </nav>
      <div id="repo-stats-header" class="header-repo-stats-host"></div>
      <button type="button" class="theme-cycle app-theme-btn">
        <span class="theme-cycle__icons" aria-hidden="true">
          <svg class="theme-cycle__svg theme-cycle__svg--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          <svg class="theme-cycle__svg theme-cycle__svg--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="theme-cycle__svg theme-cycle__svg--system" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        </span>
      </button>
    </header>
    <main class="app-main" id="main-content" tabindex="-1">
      ${content}
    </main>
    <footer class="app-footer">
      <p>Repository: <a href="${repo}" target="_blank" rel="noopener">${repo}</a> (${escapeHtml(branch)})</p>
      <p>For authoritative behavior, verify on <a href="${CURSOR_DOCS}" target="_blank" rel="noopener">cursor.com/docs</a>.</p>
      <p class="footer-thanks">Built for <a href="https://cursor.com" target="_blank" rel="noopener">Cursor IDE</a> — thanks to the Cursor team for building the AI-first code editor that makes this possible.</p>
    </footer>
    <div id="ui-announce" class="sr-only" aria-live="polite"></div>
  </div>`;
}

function cardHtml(c: Component): string {
  const short = (c.shortDescription && c.shortDescription.trim()) ||
    (c.description.length > 160 ? `${c.description.slice(0, 157).trim()}…` : c.description);
  const tags = (c.tags?.length ? c.tags : [c.type, c.category]).slice(0, 6);
  const tagsHtml = tags
    .map(
      (t) =>
        `<span class="${tagChipClass(t)}"><span class="card-tag__icon">${tagSvgForLabel(t)}</span><span class="card-tag__text">${escapeHtml(t)}</span></span>`,
    )
    .join("");
  const inv = c.invocation
    ? `<p class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300" title="Invocation"><code>${escapeHtml(c.invocation)}</code></p>`
    : "";
  return `
    <article class="component-card type-${escapeHtml(c.type)}" data-id="${escapeHtml(c.id)}">
      <div class="card-header mb-2">
        <span class="type-badge">${escapeHtml(TYPE_ICON_NAME[c.type] ?? c.type)}</span>
        <h2 class="card-title">${escapeHtml(c.name)}</h2>
      </div>
      <div class="card-tags" aria-label="Tags">${tagsHtml}</div>
      ${inv}
      <p class="card-description">${escapeHtml(short) || "—"}</p>
      <p class="card-path">${escapeHtml(c.path)}</p>
      <div class="card-actions">
        <button type="button" class="preview-btn" data-component-id="${escapeHtml(c.id)}">Preview &amp; Copy</button>
        <button type="button" class="copy-path" data-path="${escapeHtml(c.path)}">${icon("copy")}Copy path</button>
        <a class="card-link" href="${escapeHtml(c.githubUrl)}" target="_blank" rel="noopener">View source</a>
      </div>
    </article>
  `;
}

function browseSectionsHtml(list: Component[]): string {
  const grouped = groupForBrowse(list);
  return grouped
    .map(
      (sec) => `
      <details class="browse-section browse-type-accordion" aria-labelledby="browse-h-${escapeHtml(sec.typeKey)}">
        <summary class="browse-section__summary">
          <h2 class="browse-section__title type-title type-${escapeHtml(sec.typeKey)}" id="browse-h-${escapeHtml(sec.typeKey)}">${escapeHtml(sec.typeLabel)} <span class="browse-section__count">${Array.from(sec.byCategory.values()).reduce((s, a) => s + a.length, 0)}</span></h2>
        </summary>
        <div class="browse-section__body">
        ${Array.from(sec.byCategory.entries())
          .map(
            ([cat, items]) => `
          <details class="browse-subsection mb-6">
            <summary class="browse-subsection__summary">
              <span class="browse-subsection__heading">
                <span class="browse-subsection__title">${escapeHtml(cat)}</span>
                <span class="browse-subsection__count">${items.length}</span>
              </span>
            </summary>
            <div class="card-grid">
              ${items.map((c) => cardHtml(c)).join("")}
            </div>
          </details>`,
          )
          .join("")}
        </div>
      </details>`,
    )
    .join("");
}

function bindTypeAccordion(): void {
  const sections = document.querySelectorAll<HTMLDetailsElement>(".browse-type-accordion");
  sections.forEach((section) => {
    section.addEventListener("toggle", () => {
      if (!section.open) return;
      sections.forEach((other) => {
        if (other !== section && other.open) other.open = false;
      });
    });
  });
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
      : `<div class="browse-empty">
          <p>No components match your filters.</p>
          <button type="button" id="clear-browse-filters" class="clear-filters-btn">Clear filters</button>
        </div>`;
    bindTypeAccordion();
    const clearBtn = document.getElementById("clear-browse-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        replaceBrowseHash({ type: "all", category: "all", q: "" });
        window.location.hash = "browse";
      });
    }
  }
}

function browseLoadingSkeleton(): string {
  return `<section class="card-grid" aria-live="polite" aria-label="Loading components">
    ${Array.from({ length: 6 }, () => `<article class="component-card skeleton-card"><div class="skeleton-line w-30"></div><div class="skeleton-line w-90"></div><div class="skeleton-line w-70"></div></article>`).join("")}
  </section>`;
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
  const header = `
    <div class="browse-banner">
      New here? <a href="#setup">Get Started</a> to install cursor-handbook in your project.
    </div>
    <section class="top-flow">
      <section class="hero">
        <h1>Browse &amp; copy components</h1>
        <p>Search, preview, and copy reusable rules, agents, skills, commands, and hooks.</p>
      </section>
      <section class="filters">
        <div class="field">
          <label for="search">${icon("search")} Search</label>
          <input type="search" id="search" placeholder="Name, path, tags, description..." />
        </div>
        <div class="field">
          <label for="type">${icon("filter")} Type</label>
          <select id="type">
            ${TYPE_SELECT_OPTIONS.map((o) => `<option value="${o.value}" ${filters.type === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="category">${icon("folder")} Category</label>
          <select id="category">
            <option value="all">all</option>
            ${cats.map((c) => `<option value="${escapeHtml(c)}" ${filters.category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
      </section>
    </section>
    <p id="browse-count" class="browse-count"></p>
    <section id="cards" class="browse-groups">${browseLoadingSkeleton()}</section>
  `;

  app.innerHTML = appShell("browse", header);

  syncThemeControlUi();
  renderBrowseResults(payload, filters);
  void hydrateRepoStats("repo-stats-header");

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

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".preview-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-component-id");
    if (!id) return;
    const comp = payload.components.find((c) => c.id === id);
    if (comp) openContentDrawer(comp);
  });

  bindTypeAccordion();
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
      return `<li><button type="button" class="guide-inline-toc-link ${levelClass}" data-heading-link="${h.id}">${escapeHtml(h.textContent || h.id)}</button></li>`;
    })
    .join("")}</ol>`;

  const linkById = new Map<string, HTMLElement>();
  nav.querySelectorAll<HTMLElement>("[data-heading-link]").forEach((a) => {
    const id = a.getAttribute("data-heading-link");
    if (!id) return;
    linkById.set(id, a);
    a.addEventListener("click", () => {
      const heading = document.getElementById(id);
      heading?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    ? ensureExternalLinksOpenInNewTab(
        sanitizeHtmlFragment(marked.parse(active.markdown) as string),
      )
    : "<p>No matching chapters. Clear the search filter.</p>";
  const tocItems = filtered
    .map((s) => {
      const cur = active?.id === s.id ? "is-current" : "";
      const href = `#guide?id=${encodeURIComponent(s.id)}`;
      return `<li><a class="toc__link ${cur}" href="${href}">${escapeHtml(s.title)}</a></li>`;
    })
    .join("");

  const content = `
    <section class="top-flow">
      <section class="hero">
        <h1>Cursor guidelines</h1>
        <p>${filtered.length} chapters visible${active ? ` · ${readMinutes} min read` : ""}</p>
      </section>
      <section class="guide-toolbar">
        <label for="guide-filter">${icon("search")} Search chapters</label>
        <input type="search" id="guide-filter" placeholder="Filter by title or content..." />
      </section>
    </section>
    <section class="guide-layout">
      <aside class="guide-sidebar">
        <h2 class="guide-sidebar__title">Chapters</h2>
        <ol class="toc">${tocItems}</ol>
      </aside>
      <article class="guide-content prose prose-slate dark:prose-invert" id="guide-body">${bodyHtml}
        <nav id="guide-headings" class="guide-inline-toc"></nav>
        <div class="guide-bottom-nav">
          ${prev ? `<a href="#guide?id=${encodeURIComponent(prev.id)}">Previous</a>` : `<span></span>`}
          <a href="#main-content">Back to top</a>
          ${nextChapter ? `<a href="#guide?id=${encodeURIComponent(nextChapter.id)}">Next</a>` : `<span></span>`}
        </div>
      </article>
    </section>
  `;
  app.innerHTML = appShell("guide", content);

  syncThemeControlUi();
  void hydrateRepoStats("repo-stats-header");

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

/* ------------------------------------------------------------------ */
/*  Home / Landing                                                     */
/* ------------------------------------------------------------------ */

function typeCountsFromPayload(payload: Payload | null): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!payload) return counts;
  for (const c of payload.components) {
    counts[c.type] = (counts[c.type] ?? 0) + 1;
  }
  return counts;
}

function statChip(label: string, count: number, typeClass: string): string {
  return `<div class="stat-chip stat-chip--${escapeHtml(typeClass)}">
    <span class="stat-chip__count">${count}</span>
    <span class="stat-chip__label">${escapeHtml(label)}</span>
  </div>`;
}

export function renderHome(payload: Payload | null): void {
  const app = document.getElementById("app");
  if (!app) return;
  const counts = typeCountsFromPayload(payload);
  const total = payload?.componentCount ?? 117;
  const repo = repoUrl();

  const content = `
    <section class="landing-hero">
      <h1 class="landing-hero__title">The open-source rules engine for Cursor&nbsp;IDE</h1>
      <p class="landing-hero__sub">${total} components &mdash; rules, agents, skills, commands, and hooks &mdash; that turn your AI into a senior engineer who follows your standards, knows your codebase, and never wastes a token.</p>
      <div class="landing-hero__cta">
        <a href="#setup" class="btn-cta btn-cta--primary">Get Started</a>
        <a href="#browse" class="btn-cta btn-cta--secondary">Browse Components</a>
      </div>
    </section>

    <section class="landing-stats" aria-label="Component breakdown">
      ${statChip("Rules", counts["rule"] ?? 31, "rule")}
      ${statChip("Agents", counts["agent"] ?? 34, "agent")}
      ${statChip("Skills", counts["skill"] ?? 23, "skill")}
      ${statChip("Commands", counts["command"] ?? 17, "command")}
      ${statChip("Hooks", counts["hook"] ?? 12, "hook")}
    </section>

    <section class="landing-problem">
      <h2 class="landing-section__title">The problem</h2>
      <p class="landing-section__sub">Every time you open Cursor, your AI starts from zero.</p>
      <div class="problem-grid">
        <div class="problem-card">
          <div class="problem-card__icon">${svgIcon("refresh")}</div>
          <h3>Repeats itself</h3>
          <p>You explain the same conventions, patterns, and security rules every session.</p>
        </div>
        <div class="problem-card">
          <div class="problem-card__icon">${svgIcon("tokens")}</div>
          <h3>Burns tokens</h3>
          <p>Runs the full test suite (100K+ tokens) when a type-check would do.</p>
        </div>
        <div class="problem-card">
          <div class="problem-card__icon">${svgIcon("shield")}</div>
          <h3>Ignores security</h3>
          <p>Happily hardcodes API keys, logs PII, and exposes infrastructure names.</p>
        </div>
      </div>
    </section>

    <section class="landing-solution">
      <h2 class="landing-section__title">How cursor-handbook fixes it</h2>
      <p class="landing-section__sub">Permanent memory for your AI &mdash; standards, security, and workflows baked into every prompt.</p>
      <div class="steps-grid">
        <div class="step-card">
          <span class="step-card__num">1</span>
          <h3>Install</h3>
          <p>Use the Setup Agent, clone, or add from GitHub &mdash; pick the method that fits your workflow.</p>
        </div>
        <div class="step-card">
          <span class="step-card__num">2</span>
          <h3>Configure</h3>
          <p>Edit <code>project.json</code> with your stack, naming conventions, and domain entities.</p>
        </div>
        <div class="step-card">
          <span class="step-card__num">3</span>
          <h3>Code</h3>
          <p>Your AI now follows your standards automatically &mdash; security, testing, architecture, logging.</p>
        </div>
      </div>
    </section>

    <section class="landing-thanks">
      <div class="thanks-card">
        <p class="thanks-card__text">Built for <a href="https://cursor.com" target="_blank" rel="noopener">Cursor IDE</a> &mdash; thanks to the Cursor team for building the AI-first code editor that makes projects like this possible.</p>
      </div>
    </section>

    <section class="landing-links">
      <h2 class="landing-section__title">Explore</h2>
      <div class="quick-links-grid">
        <a href="#setup" class="quick-link-card">
          <h3>Get Started</h3>
          <p>Step-by-step installation with multiple methods.</p>
        </a>
        <a href="#browse" class="quick-link-card">
          <h3>Browse Components</h3>
          <p>Search, filter, preview, and copy any component.</p>
        </a>
        <a href="#guide" class="quick-link-card">
          <h3>Guidelines</h3>
          <p>Learn Cursor IDE patterns and best practices.</p>
        </a>
        <a href="${escapeHtml(repo)}" target="_blank" rel="noopener" class="quick-link-card">
          <h3>GitHub Repo</h3>
          <p>Star, fork, or contribute to the project.</p>
        </a>
      </div>
    </section>
  `;

  app.innerHTML = appShell("home", content);
  syncThemeControlUi();
  void hydrateRepoStats("repo-stats-header");
}

function svgIcon(name: string): string {
  const c = `class="landing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  if (name === "refresh")
    return `<svg ${c}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
  if (name === "tokens")
    return `<svg ${c}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  if (name === "shield")
    return `<svg ${c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  return "";
}

/* ------------------------------------------------------------------ */
/*  Get Started / Setup                                                */
/* ------------------------------------------------------------------ */

export function renderSetup(): void {
  const app = document.getElementById("app");
  if (!app) return;
  const repo = repoUrl();

  const content = `
    <section class="setup-hero">
      <h1>Get Started with cursor-handbook</h1>
      <p>Pick the installation method that fits your workflow. All methods give you the same components.</p>
    </section>

    <section class="setup-methods">
      <article class="method-card method-card--recommended">
        <div class="method-card__badge">Recommended</div>
        <h2>Cursor Setup Agent</h2>
        <p>The smartest approach. The agent scans your project, detects your tech stack, and installs only the components you need.</p>
        <div class="method-steps">
          <div class="method-step">
            <span class="method-step__num">1</span>
            <div>
              <p class="method-step__label">Clone the repo into your project:</p>
              <div class="command-block">
                <code>git clone ${escapeHtml(repo)}.git .cursor-handbook</code>
                <button type="button" class="copy-cmd" data-cmd="git clone ${escapeHtml(repo)}.git .cursor-handbook">Copy</button>
              </div>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">2</span>
            <div>
              <p class="method-step__label">Open your project in Cursor and run:</p>
              <div class="command-block">
                <code>@cursor-setup-agent</code>
                <button type="button" class="copy-cmd" data-cmd="@cursor-setup-agent">Copy</button>
              </div>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">3</span>
            <div>
              <p class="method-step__label">The agent generates <code>project.json</code>, selects components for your stack, and sets up <code>.cursor/</code>.</p>
            </div>
          </div>
        </div>
      </article>

      <article class="method-card">
        <h2>Clone &amp; Copy</h2>
        <p>Use the full rules engine. Clone, copy the <code>.cursor</code> folder, and customize.</p>
        <div class="method-steps">
          <div class="method-step">
            <span class="method-step__num">1</span>
            <div>
              <div class="command-block">
                <code>git clone ${escapeHtml(repo)}.git cursor-handbook</code>
                <button type="button" class="copy-cmd" data-cmd="git clone ${escapeHtml(repo)}.git cursor-handbook">Copy</button>
              </div>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">2</span>
            <div>
              <div class="command-block">
                <code>cp -r cursor-handbook/.cursor your-project/.cursor</code>
                <button type="button" class="copy-cmd" data-cmd="cp -r cursor-handbook/.cursor your-project/.cursor">Copy</button>
              </div>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">3</span>
            <div>
              <p class="method-step__label">Edit <code>.cursor/config/project.json</code> with your stack details. Restart Cursor.</p>
            </div>
          </div>
        </div>
      </article>

      <article class="method-card">
        <h2>npm / Artifactory</h2>
        <p>One command to scaffold everything. Ideal for teams using a private registry (JFrog Artifactory, Verdaccio, GitHub Packages).</p>
        <div class="method-steps">
          <div class="method-step">
            <span class="method-step__num">1</span>
            <div>
              <p class="method-step__label">Run from your project root:</p>
              <div class="command-block">
                <code>npx cursor-handbook init</code>
                <button type="button" class="copy-cmd" data-cmd="npx cursor-handbook init">Copy</button>
              </div>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">2</span>
            <div>
              <p class="method-step__label">Edit <code>.cursor/config/project.json</code> &mdash; replace <code>{{PLACEHOLDER}}</code> values with your stack details.</p>
            </div>
          </div>
          <div class="method-step">
            <span class="method-step__num">3</span>
            <div>
              <p class="method-step__label">Remove the package once setup is done:</p>
              <div class="command-block">
                <code>npm uninstall cursor-handbook</code>
                <button type="button" class="copy-cmd" data-cmd="npm uninstall cursor-handbook">Copy</button>
              </div>
            </div>
          </div>
        </div>
        <p class="method-note">For private registries, publish first with <code>npm publish --registry https://your-registry</code>, then teams install via <code>npx cursor-handbook init</code>.</p>
      </article>

      <article class="method-card">
        <h2>Add from GitHub (Cursor UI)</h2>
        <p>Add rules, skills, or agents without cloning &mdash; directly from Cursor Settings.</p>
        <div class="method-steps">
          <div class="method-step">
            <span class="method-step__num">1</span>
            <div><p class="method-step__label">Open Cursor IDE &rarr; <strong>Settings &rarr; Rules / Skills / Agents</strong></p></div>
          </div>
          <div class="method-step">
            <span class="method-step__num">2</span>
            <div><p class="method-step__label">Click <strong>Add new &rarr; Add from GitHub</strong></p></div>
          </div>
          <div class="method-step">
            <span class="method-step__num">3</span>
            <div>
              <p class="method-step__label">Paste the repo URL:</p>
              <div class="command-block">
                <code>${escapeHtml(repo)}</code>
                <button type="button" class="copy-cmd" data-cmd="${escapeHtml(repo)}">Copy</button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="method-card">
        <h2>Pick &amp; Choose</h2>
        <p>Download only the components you need. Browse, preview the content, and copy individual files.</p>
        <div class="method-steps">
          <div class="method-step">
            <span class="method-step__num">1</span>
            <div><p class="method-step__label">Go to <a href="#browse">Browse Components</a></p></div>
          </div>
          <div class="method-step">
            <span class="method-step__num">2</span>
            <div><p class="method-step__label">Find the component you want, click <strong>Preview &amp; Copy</strong></p></div>
          </div>
          <div class="method-step">
            <span class="method-step__num">3</span>
            <div><p class="method-step__label">Paste the content into the matching path in your project's <code>.cursor/</code> folder.</p></div>
          </div>
        </div>
      </article>
    </section>

    <section class="setup-next">
      <h2 class="landing-section__title">What's next?</h2>
      <div class="quick-links-grid">
        <a href="#browse" class="quick-link-card">
          <h3>Browse Components</h3>
          <p>Search, filter, and copy any of the ${escapeHtml(String(117))} components.</p>
        </a>
        <a href="#guide" class="quick-link-card">
          <h3>Read Guidelines</h3>
          <p>Learn Cursor IDE patterns and best practices.</p>
        </a>
        <a href="${escapeHtml(repo)}" target="_blank" rel="noopener" class="quick-link-card">
          <h3>View on GitHub</h3>
          <p>Star, fork, or open an issue.</p>
        </a>
      </div>
    </section>
  `;

  app.innerHTML = appShell("setup", content);
  syncThemeControlUi();
  void hydrateRepoStats("repo-stats-header");
  bindCopyCommands();
}

function bindCopyCommands(): void {
  document.querySelectorAll<HTMLButtonElement>(".copy-cmd").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (!cmd) return;
      void copyWithFeedback(cmd);
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Copy"; }, 1500);
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Content Preview Drawer (Browse)                                    */
/* ------------------------------------------------------------------ */

export function openContentDrawer(component: Component): void {
  closeContentDrawer();

  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.addEventListener("click", closeContentDrawer);

  const drawer = document.createElement("aside");
  drawer.className = "content-drawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-label", `Preview: ${component.name}`);
  drawer.innerHTML = `
    <div class="drawer-header">
      <div>
        <span class="type-badge">${escapeHtml(TYPE_ICON_NAME[component.type] ?? component.type)}</span>
        <h2 class="drawer-title">${escapeHtml(component.name)}</h2>
      </div>
      <button type="button" class="drawer-close" aria-label="Close preview">&times;</button>
    </div>
    <p class="drawer-path">${escapeHtml(component.path)}</p>
    <div class="drawer-actions">
      <button type="button" class="btn-cta btn-cta--primary drawer-copy-content" disabled>Copy file content</button>
      <a class="btn-cta btn-cta--secondary" href="${escapeHtml(component.githubUrl)}" target="_blank" rel="noopener">View on GitHub</a>
    </div>
    <div class="drawer-body">
      <div class="drawer-loading">Loading content&hellip;</div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.classList.add("drawer-open");

  requestAnimationFrame(() => {
    overlay.classList.add("is-visible");
    drawer.classList.add("is-visible");
  });

  drawer.querySelector(".drawer-close")?.addEventListener("click", closeContentDrawer);

  void fetchRawContent(component.rawUrl).then((text) => {
    const body = drawer.querySelector(".drawer-body");
    if (!body) return;
    body.innerHTML = `<pre class="drawer-code"><code>${escapeHtml(text)}</code></pre>`;

    const copyBtn = drawer.querySelector<HTMLButtonElement>(".drawer-copy-content");
    if (copyBtn) {
      copyBtn.disabled = false;
      copyBtn.addEventListener("click", () => {
        void navigator.clipboard.writeText(text).then(() => {
          announce(`Copied content of ${component.name}`);
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy file content"; }, 1500);
        });
      });
    }
  }).catch(() => {
    const body = drawer.querySelector(".drawer-body");
    if (body) body.innerHTML = `<p class="drawer-error">Could not load file content. <a href="${escapeHtml(component.rawUrl)}" target="_blank" rel="noopener">Open raw file</a></p>`;
  });
}

function closeContentDrawer(): void {
  const overlay = document.querySelector(".drawer-overlay");
  const drawer = document.querySelector(".content-drawer");
  overlay?.classList.remove("is-visible");
  drawer?.classList.remove("is-visible");
  document.body.classList.remove("drawer-open");
  setTimeout(() => {
    overlay?.remove();
    drawer?.remove();
  }, 200);
}
