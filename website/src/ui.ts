export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function announce(message: string): void {
  const el = document.getElementById("ui-announce");
  if (!el) return;
  el.textContent = "";
  window.setTimeout(() => {
    el.textContent = message;
  }, 10);
}

export async function copyWithFeedback(path: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(path);
    announce(`Copied path: ${path}`);
  } catch {
    announce("Unable to copy path to clipboard.");
  }
}

export function sanitizeHtmlFragment(input: string): string {
  const doc = new DOMParser().parseFromString(input, "text/html");
  const blockedTags = new Set([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "meta",
    "link",
  ]);
  for (const node of Array.from(doc.body.querySelectorAll("*"))) {
    const tag = node.tagName.toLowerCase();
    if (blockedTags.has(tag)) {
      node.remove();
      continue;
    }
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith("on")) {
        node.removeAttribute(attr.name);
        continue;
      }
      if (
        (name === "href" || name === "src" || name === "xlink:href") &&
        value.startsWith("javascript:")
      ) {
        node.removeAttribute(attr.name);
      }
    }
  }
  return doc.body.innerHTML;
}
