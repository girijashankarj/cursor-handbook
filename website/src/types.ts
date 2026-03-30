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
  view: "browse" | "guide";
  sectionId?: string;
  browse?: BrowseFilters;
}
