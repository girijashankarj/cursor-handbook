import { parseHash, setGuideHash } from "./router";
import { applySiteMeta, loadComponents, loadGuide } from "./services";
import {
  getCachedComponents,
  getCachedGuide,
  getGuideFilter,
  setCachedComponents,
  setCachedGuide,
  setGuideFilter,
} from "./state";
import { applyColorScheme, bindSystemThemeChange, cycleThemePreference } from "./theme";
import { copyWithFeedback, escapeHtml } from "./ui";
import { normalizeBrowseFilters, pickSectionId, renderBrowse, renderGuide, renderHome, renderSetup } from "./views";

function refreshViewAfterThemeChange(): void {
  const { view, sectionId } = parseHash();
  if (view === "home") {
    renderHome(getCachedComponents());
    return;
  }
  if (view === "setup") {
    renderSetup();
    return;
  }
  const cachedGuide = getCachedGuide();
  if (view === "guide" && cachedGuide) {
    const activeId = pickSectionId(cachedGuide, sectionId, getGuideFilter());
    renderGuide(cachedGuide, activeId, getGuideFilter(), (next) => {
      setGuideFilter(next);
    });
    return;
  }
  const cachedComponents = getCachedComponents();
  if (view === "browse" && cachedComponents) {
    const raw = parseHash().browse ?? { type: "all", category: "all", q: "" };
    renderBrowse(cachedComponents, normalizeBrowseFilters(cachedComponents, raw));
  }
}

async function route(): Promise<void> {
  const parsed = parseHash();
  try {
    if (parsed.view === "home") {
      let cachedComponents = getCachedComponents();
      if (!cachedComponents) {
        try {
          cachedComponents = await loadComponents();
          setCachedComponents(cachedComponents);
        } catch {
          // Home page works without component data
        }
      }
      if (cachedComponents) applySiteMeta(cachedComponents);
      renderHome(cachedComponents);
      return;
    }

    if (parsed.view === "setup") {
      renderSetup();
      return;
    }

    if (parsed.view === "guide") {
      let cachedGuide = getCachedGuide();
      if (!cachedGuide) cachedGuide = await loadGuide();
      if (!getCachedGuide()) setCachedGuide(cachedGuide);
      applySiteMeta(cachedGuide);
      const activeId = pickSectionId(cachedGuide, parsed.sectionId, getGuideFilter());
      if (activeId && activeId !== parsed.sectionId) {
        setGuideHash(activeId);
        return;
      }
      renderGuide(cachedGuide, activeId, getGuideFilter(), (next) => {
        setGuideFilter(next);
      });
      return;
    }

    let cachedComponents = getCachedComponents();
    if (!cachedComponents) cachedComponents = await loadComponents();
    if (!getCachedComponents()) setCachedComponents(cachedComponents);
    applySiteMeta(cachedComponents);
    const raw = parsed.browse ?? { type: "all", category: "all", q: "" };
    renderBrowse(cachedComponents, normalizeBrowseFilters(cachedComponents, raw));
  } catch (err) {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `<div class="layout w-full bg-slate-100 px-0 py-5 dark:bg-slate-950">
      <div class="content-shell mx-auto w-full max-w-screen-xl px-3 sm:px-4 lg:px-6">
        <main id="main-content" class="main-flow" tabindex="-1">
          <p class="error rounded-xl border border-rose-300/40 bg-rose-50 p-4 text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-300">${escapeHtml(String(err))}</p>
        </main>
      </div>
    </div>`;
  }
}

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest(".theme-cycle")) {
    e.preventDefault();
    cycleThemePreference();
    refreshViewAfterThemeChange();
    return;
  }
  if (t.classList.contains("copy-path")) {
    const path = t.getAttribute("data-path");
    if (path) void copyWithFeedback(path);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const drawer = document.querySelector(".content-drawer.is-visible");
    if (drawer) {
      const overlay = document.querySelector(".drawer-overlay");
      overlay?.classList.remove("is-visible");
      drawer.classList.remove("is-visible");
      document.body.classList.remove("drawer-open");
      setTimeout(() => { overlay?.remove(); drawer.remove(); }, 200);
      return;
    }
  }

  const target = e.target as HTMLElement | null;
  const isTypingTarget =
    !!target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable);
  if (isTypingTarget || e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === "/") {
    e.preventDefault();
    const input = document.getElementById("search") as HTMLInputElement | null;
    const guideInput = document.getElementById("guide-filter") as HTMLInputElement | null;
    (guideInput ?? input)?.focus();
    return;
  }

  if (e.key.toLowerCase() === "h") {
    e.preventDefault();
    window.location.hash = "home";
    return;
  }

  if (e.key.toLowerCase() === "g") {
    e.preventDefault();
    window.location.hash = "guide";
    return;
  }

  if (e.key.toLowerCase() === "b") {
    e.preventDefault();
    window.location.hash = "browse";
  }
});

window.addEventListener("hashchange", () => {
  void route();
});

applyColorScheme();
bindSystemThemeChange(refreshViewAfterThemeChange);
void route();
