import type { GuidePayload, Payload } from "./types";

interface AppState {
  guideFilter: string;
  cachedComponents: Payload | null;
  cachedGuide: GuidePayload | null;
}

const state: AppState = {
  guideFilter: "",
  cachedComponents: null,
  cachedGuide: null,
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
