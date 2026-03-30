import { defineConfig } from "vite";

// GitHub Pages project site: https://<user>.github.io/<repo>/
// Set VITE_SITE_URL in CI for correct og:url / canonical (fork-friendly).
const siteUrl = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const defaultBuildBase = "/cursor-handbook/";

function normalizeBasePath(raw: string | undefined): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return defaultBuildBase;
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export default defineConfig(({ command }) => ({
  base:
    command === "build" ? normalizeBasePath(process.env.VITE_BASE_PATH) : "/",
  plugins: [
    {
      name: "inject-og",
      enforce: "pre",
      transformIndexHtml(html: string) {
        if (!siteUrl) return html;
        const page = `${siteUrl}/`;
        const image = `${siteUrl}/favicon.svg`;
        const extra = `    <meta property="og:url" content="${page}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${page}" />
`;
        return html.replace("</head>", `${extra}</head>`);
      },
    },
  ],
}));
