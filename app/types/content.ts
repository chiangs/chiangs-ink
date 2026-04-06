export type ArticleFrontmatter = {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  tags?: string[];
  featured: boolean;
  order: number;
  status?: "draft" | "published";
  slug?: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
  animate?: "count" | "fade";
};

export type ProjectStack = {
  frameworks?: string[];
  languages?: string[];
  platforms?: string[];
};

export type ProjectFrontmatter = {
  title: string;
  positioning: string;
  client: string;
  clientContext?: string;
  roles: string[];
  year: number;
  status: "Live" | "Delivered" | "Ongoing" | "Confidential";
  tags?: string[];
  industry?: string;
  industries?: string[];
  solutionType?: string[];
  metrics?: ProjectMetric[];
  stack?: ProjectStack;
  heroImage?: string;
  heroPattern?: "dots" | "lines" | "crosshatch" | "waves" | "none";
  featured?: boolean;
  order?: number;
  publishStatus?: "published" | "draft";
  slug?: string;
  nda?: boolean;
  team?: {
    delivery?: string[];
    client?: string[];
  };
};
