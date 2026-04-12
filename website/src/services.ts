import { escapeHtml } from "./ui";
import type { GuidePayload, Payload, RepoStats } from "./types";

let siteRepo = "girijashankarj/cursor-handbook";
let siteBranch = "main";
let cachedRepoStats: RepoStats | null = null;
let cachedRepoStatsFor = "";

export function applySiteMeta(meta: { repo?: string; branch?: string } | undefined): void {
  if (meta?.repo) siteRepo = meta.repo;
  if (meta?.branch) siteBranch = meta.branch;
}

export function currentSiteMeta(): { repo: string; branch: string } {
  return { repo: siteRepo, branch: siteBranch };
}

export function repoUrl(): string {
  return `https://github.com/${siteRepo}`;
}

export function issuesUrl(): string {
  return `${repoUrl()}/issues`;
}

export function blobUrl(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, "");
  return `https://github.com/${siteRepo}/blob/${siteBranch}/${p}`;
}

export function treeUrl(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://github.com/${siteRepo}/tree/${siteBranch}/${p}`;
}

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

const STAR_SVG = `<svg class="repo-stat-inline__svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>`;
const FORK_SVG = `<svg class="repo-stat-inline__svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>`;
const ISSUE_SVG = `<svg class="repo-stat-inline__svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="8" cy="11.5" r=".75"/></svg>`;
const WATCHER_SVG = `<svg class="repo-stat-inline__svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Zm0 10.5A4.5 4.5 0 1 1 8 3.5a4.5 4.5 0 0 1 0 9Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2"/></svg>`;

function repoStatsPanelInner(stats: RepoStats): string {
  const iso = escapeHtml(stats.updatedAt);
  return `<div class="header-repo-stats-panel" role="region" aria-label="Repository stats">
    <p class="header-repo-stats-panel__title">Repository stats</p>
    <div class="header-repo-stats__chips">
      <span class="header-repo-stats__chip">${ISSUE_SVG} Issues ${formatCount(stats.openIssues)}</span>
      <span class="header-repo-stats__chip">${WATCHER_SVG} Watchers ${formatCount(stats.watchers)}</span>
    </div>
    <time class="header-repo-stats__updated" datetime="${iso}">Updated ${formatDate(stats.updatedAt)}</time>
  </div>`;
}

/** Visible star/fork chips in header; issues/watchers in dropdown. */
export function repoStatsHtml(
  stats: RepoStats | null,
  opts: { loading?: boolean; unavailable?: boolean } = {},
): string {
  const repoHref = `https://github.com/${siteRepo}`;
  if (opts.loading) {
    return `<div class="repo-stats-bar" aria-live="polite" aria-busy="true">
      <span class="repo-stat-inline repo-stat-inline--loading">${STAR_SVG} —</span>
      <span class="repo-stat-inline repo-stat-inline--loading">${FORK_SVG} —</span>
    </div>`;
  }
  if (opts.unavailable) {
    return `<div class="repo-stats-bar" aria-live="polite">
      <a class="repo-stat-inline" href="${repoHref}/stargazers" target="_blank" rel="noopener">${STAR_SVG} Star</a>
      <a class="repo-stat-inline" href="${repoHref}/fork" target="_blank" rel="noopener">${FORK_SVG} Fork</a>
    </div>`;
  }
  if (!stats) return "";
  return `<div class="repo-stats-bar" aria-live="polite">
    <a class="repo-stat-inline" href="${repoHref}/stargazers" target="_blank" rel="noopener" title="${stats.stars} stars">${STAR_SVG} ${formatCount(stats.stars)}</a>
    <a class="repo-stat-inline" href="${repoHref}/fork" target="_blank" rel="noopener" title="${stats.forks} forks">${FORK_SVG} ${formatCount(stats.forks)}</a>
    <details class="header-repo-stats-dropdown">
      <summary class="repo-stat-inline repo-stat-inline--more" title="More stats">···</summary>
      ${repoStatsPanelInner(stats)}
    </details>
  </div>`;
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

export async function hydrateRepoStats(containerId: string): Promise<void> {
  const host = document.getElementById(containerId);
  if (!host) return;
  host.innerHTML = repoStatsHtml(
    cachedRepoStatsFor === siteRepo ? cachedRepoStats : null,
    { loading: true },
  );
  const stats = await loadRepoStats();
  if (!host.isConnected) return;
  host.innerHTML = stats
    ? repoStatsHtml(stats)
    : repoStatsHtml(null, { unavailable: true });
}

export async function loadComponents(): Promise<Payload> {
  const url = `${import.meta.env.BASE_URL}components.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

export async function loadGuide(): Promise<GuidePayload> {
  const url = `${import.meta.env.BASE_URL}guide.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

const contentCache = new Map<string, string>();

export async function fetchRawContent(rawUrl: string): Promise<string> {
  const cached = contentCache.get(rawUrl);
  if (cached !== undefined) return cached;
  const res = await fetch(rawUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${rawUrl}: ${res.status}`);
  const text = await res.text();
  contentCache.set(rawUrl, text);
  return text;
}
