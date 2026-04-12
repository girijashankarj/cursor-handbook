import type { DocsPayload, GuidePayload, Payload } from "./types";

interface AppState {
  guideFilter: string;
  docsFilter: string;
  cachedComponents: Payload | null;
  cachedGuide: GuidePayload | null;
  cachedDocs: DocsPayload | null;
}

const state: AppState = {
  guideFilter: "",
  docsFilter: "",
  cachedComponents: null,
  cachedGuide: null,
  cachedDocs: null,
};

export function getGuideFilter(): string {
  return state.guideFilter;
}

export function setGuideFilter(next: string): void {
  state.guideFilter = next;
}

export function getCachedComponents(): Payload | null {
  return state.cachedComponents;
}

export function setCachedComponents(next: Payload): void {
  state.cachedComponents = next;
}

export function getCachedGuide(): GuidePayload | null {
  return state.cachedGuide;
}

export function setCachedGuide(next: GuidePayload): void {
  state.cachedGuide = next;
}

export function getDocsFilter(): string {
  return state.docsFilter;
}

export function setDocsFilter(next: string): void {
  state.docsFilter = next;
}

export function getCachedDocs(): DocsPayload | null {
  return state.cachedDocs;
}

export function setCachedDocs(next: DocsPayload): void {
  state.cachedDocs = next;
}
