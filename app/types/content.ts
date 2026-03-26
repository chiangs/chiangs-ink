export type ArticleFrontmatter = {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  order: number;
  slug?: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectFrontmatter = {
  title: string;
  client: string;
  clientContext: string;
  roles: string[];
  year: string;
  status: string;
  tags: string[];
  industry: string[];
  solutionType: string[];
  metrics: ProjectMetric[];
  heroImage: string;
  featured: boolean;
  order: number;
  slug?: string;
};
