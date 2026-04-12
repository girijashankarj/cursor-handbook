import type { BrowseFilters, ParsedHash } from "./types";

const VALID_BROWSE_TYPES = new Set([
  "all",
  "rule",
  "agent",
  "skill",
  "command",
  "hook",
]);

export function parseHash(): ParsedHash {
  let raw = window.location.hash.replace(/^#/, "").trim();
  if (!raw) raw = "home";
  const qIdx = raw.indexOf("?");
  const path = qIdx === -1 ? raw : raw.slice(0, qIdx);
  const qs = qIdx === -1 ? "" : raw.slice(qIdx + 1);
  const params = qs ? new URLSearchParams(qs) : new URLSearchParams();

  if (path === "home") {
    return { view: "home" };
  }

  if (path === "setup") {
    return { view: "setup" };
  }

  if (path === "guide") {
    return {
      view: "guide",
      sectionId: params.get("id") || undefined,
    };
  }

  if (path === "docs") {
    return {
      view: "docs",
      docsSectionId: params.get("section") || undefined,
      docsDocId: params.get("id") || undefined,
    };
  }

  if (path === "browse") {
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

  return { view: "home" };
}

function buildBrowseHash(filters: BrowseFilters): string {
  const params = new URLSearchParams();
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.q.trim()) params.set("q", filters.q.trim());
  const s = params.toString();
  return s ? `browse?${s}` : "browse";
}

export function replaceBrowseHash(filters: BrowseFilters): void {
  const nextHash = `#${buildBrowseHash(filters)}`;
  if (window.location.hash === nextHash) return;
  const path = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", path);
}

export function setGuideHash(sectionId: string): void {
  window.location.hash = `guide?id=${encodeURIComponent(sectionId)}`;
}

export function setDocsHash(sectionId: string, docId: string): void {
  window.location.hash = `docs?section=${encodeURIComponent(sectionId)}&id=${encodeURIComponent(docId)}`;
}
