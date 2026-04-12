export interface Component {
  id: string;
  type: string;
  path: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  invocation: string;
  tags?: string[];
  githubUrl: string;
  rawUrl: string;
}

export interface Payload {
  repo?: string;
  branch?: string;
  componentCount: number;
  components: Component[];
}

export interface GuideSection {
  id: string;
  title: string;
  markdown: string;
}

export interface GuidePayload {
  repo?: string;
  branch?: string;
  sectionCount: number;
  sections: GuideSection[];
}

export interface DocsEntry {
  id: string;
  title: string;
  path: string;
  markdown: string;
}

export interface DocsSection {
  id: string;
  title: string;
  docCount: number;
  docs: DocsEntry[];
}

export interface DocsPayload {
  repo?: string;
  branch?: string;
  sectionCount: number;
  docCount: number;
  sections: DocsSection[];
}

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  updatedAt: string;
}

export interface BrowseFilters {
  type: string;
  category: string;
  q: string;
}

export interface ParsedHash {
  view: "home" | "setup" | "browse" | "guide" | "docs";
  sectionId?: string;
  docsSectionId?: string;
  docsDocId?: string;
  browse?: BrowseFilters;
}
