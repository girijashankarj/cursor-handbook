import { marked } from "marked";
import { currentSiteMeta, hydrateRepoStats, repoUrl } from "./services";
import { parseHash, replaceBrowseHash, setGuideHash } from "./router";
import { syncThemeControlUi } from "./theme";
import type { BrowseFilters, Component, GuidePayload, GuideSection, Payload } from "./types";
import { debounce, ensureExternalLinksOpenInNewTab, escapeHtml, sanitizeHtmlFragment } from "./ui";

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

function appShell(active: "browse" | "guide", content: string): string {
  const repo = repoUrl();
  const branch = currentSiteMeta().branch;
  return `<div class="app-shell">
    <header class="app-topbar">
      <a class="app-logo" href="#browse" aria-label="cursor-handbook home">
        <img src="${ASSET_BASE}favicon.svg" width="26" height="26" alt="" />
        <span>cursor-handbook</span>
      </a>
      <nav class="app-nav" aria-label="Primary">
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
        <button type="button" class="copy-path" data-path="${escapeHtml(c.path)}">${icon("copy")}Copy path</button>
        <a class="card-link" href="${escapeHtml(c.githubUrl)}" target="_blank" rel="noopener">View source</a>
        <a class="card-link" href="${escapeHtml(c.rawUrl)}" target="_blank" rel="noopener">Raw file</a>
      </div>
    </article>
  `;
}

function browseSectionsHtml(list: Component[]): string {
  const grouped = groupForBrowse(list);
  return grouped
    .map(
      (sec) => `
      <section class="browse-section" aria-labelledby="browse-h-${escapeHtml(sec.typeKey)}">
        <h2 class="browse-section__title type-title type-${escapeHtml(sec.typeKey)}" id="browse-h-${escapeHtml(sec.typeKey)}">${escapeHtml(sec.typeLabel)}</h2>
        ${Array.from(sec.byCategory.entries())
          .map(
            ([cat, items], idx) => `
          <details class="browse-subsection mb-6" ${idx === 0 ? "open" : ""}>
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
      : `<div class="browse-empty">
          <p>No components match your filters.</p>
          <button type="button" id="clear-browse-filters" class="clear-filters-btn">Clear filters</button>
        </div>`;
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
    <section class="top-flow">
      <section class="hero">
        <h1>Design system for Cursor teams</h1>
        <p>Browse reusable rules, agents, skills, commands, and hooks with instant filters.</p>
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
