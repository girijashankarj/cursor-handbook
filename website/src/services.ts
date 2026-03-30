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

export function repoStatsHtml(
  stats: RepoStats | null,
  opts: { loading?: boolean; unavailable?: boolean } = {},
): string {
  if (opts.loading) {
    return `<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-live="polite">Loading repository stats…</section>`;
  }
  if (opts.unavailable) {
    return `<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-live="polite">Repository stats are temporarily unavailable (GitHub API limit or network issue).</section>`;
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
