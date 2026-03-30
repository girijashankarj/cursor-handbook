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

const REPO_STATS_ICON = `<svg class="header-repo-stats__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-4"/></svg>`;

function repoStatsPanelInner(stats: RepoStats): string {
  const iso = escapeHtml(stats.updatedAt);
  return `<div class="header-repo-stats-panel" role="region" aria-label="Repository stats">
    <p class="header-repo-stats-panel__title">Repository stats</p>
    <div class="header-repo-stats__chips">
      <span class="header-repo-stats__chip">Stars ${formatCount(stats.stars)}</span>
      <span class="header-repo-stats__chip">Forks ${formatCount(stats.forks)}</span>
      <span class="header-repo-stats__chip">Open issues ${formatCount(stats.openIssues)}</span>
      <span class="header-repo-stats__chip">Watchers ${formatCount(stats.watchers)}</span>
    </div>
    <time class="header-repo-stats__updated" datetime="${iso}">Updated ${formatDate(stats.updatedAt)}</time>
  </div>`;
}

/** Icon in header; full stats in dropdown panel (`#repo-stats-header`). */
export function repoStatsHtml(
  stats: RepoStats | null,
  opts: { loading?: boolean; unavailable?: boolean } = {},
): string {
  if (opts.loading) {
    return `<div class="header-repo-stats-dropdown" aria-live="polite">
      <span class="header-repo-stats-icon-btn header-repo-stats-icon-btn--loading" title="Loading repository stats" aria-busy="true">${REPO_STATS_ICON}</span>
    </div>`;
  }
  if (opts.unavailable) {
    return `<div class="header-repo-stats-dropdown" aria-live="polite">
      <span class="header-repo-stats-icon-btn header-repo-stats-icon-btn--muted" title="Repository stats unavailable (API limit or network)">${REPO_STATS_ICON}</span>
    </div>`;
  }
  if (!stats) return "";
  return `<details class="header-repo-stats-dropdown">
    <summary class="header-repo-stats-icon-btn" title="Repository stats" aria-label="Show repository stats">${REPO_STATS_ICON}</summary>
    ${repoStatsPanelInner(stats)}
  </details>`;
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
