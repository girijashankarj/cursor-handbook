const THEME_STORAGE_KEY = "cursor-handbook-theme";

export type ThemePreference = "system" | "light" | "dark";

export function getThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // private mode
  }
  return "system";
}

function setThemePreference(p: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, p);
  } catch {
    // ignore
  }
}

function resolveColorScheme(p: ThemePreference): "light" | "dark" {
  if (p === "light") return "light";
  if (p === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function themePreferenceLabel(p: ThemePreference): string {
  if (p === "system") return "System";
  if (p === "light") return "Light";
  return "Dark";
}

export function syncThemeControlUi(): void {
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

export function applyColorScheme(): void {
  const pref = getThemePreference();
  const resolved = resolveColorScheme(pref);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  const meta = document.getElementById(
    "meta-theme-color",
  ) as HTMLMetaElement | null;
  if (meta)
    meta.setAttribute("content", resolved === "light" ? "#f8fafc" : "#0f1419");
  syncThemeControlUi();
}

export function cycleThemePreference(): void {
  const order: ThemePreference[] = ["system", "light", "dark"];
  const cur = getThemePreference();
  const i = order.indexOf(cur);
  const next = order[(i + 1) % order.length]!;
  setThemePreference(next);
  applyColorScheme();
}

export function bindSystemThemeChange(onChange: () => void): void {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getThemePreference() !== "system") return;
      applyColorScheme();
      onChange();
    });
}
