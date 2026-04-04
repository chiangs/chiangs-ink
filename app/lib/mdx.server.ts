// MDX loader utilities
// Server-only — never import in client components

import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import type { ArticleFrontmatter, ProjectFrontmatter } from "~/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Get all articles sorted by date descending
export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const dir = path.join(CONTENT_DIR, "writing");
  const files = await fs.readdir(dir);

  const articles = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(dir, file), "utf-8");
        const { data } = matter(source);
        return {
          ...(data as ArticleFrontmatter),
          slug: file.replace(".mdx", ""),
        };
      }),
  );

  const isDev = process.env.NODE_ENV === "development";

  return articles
    .filter((a) => isDev || a.status !== "draft")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get single article by slug
export async function getArticle(slug: string) {
  const filePath = path.join(CONTENT_DIR, "writing", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(source);
  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    slug,
  };
}

// Get all projects sorted by order ascending
export async function getAllProjects(): Promise<ProjectFrontmatter[]> {
  const dir = path.join(CONTENT_DIR, "work");
  const files = await fs.readdir(dir);

  const projects = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(dir, file), "utf-8");
        const { data } = matter(source);
        return {
          ...(data as ProjectFrontmatter),
          slug: file.replace(".mdx", ""),
        };
      }),
  );

  return projects
    .filter((p) => p.publishStatus !== "draft")
    .sort((a, b) => a.order - b.order);
}

// Get single project by slug
export async function getProject(slug: string) {
  const filePath = path.join(CONTENT_DIR, "work", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(source);
  return {
    frontmatter: data as ProjectFrontmatter,
    content,
    slug,
  };
}

// Get featured articles (max 3) — drafts already excluded by getAllArticles
export async function getFeaturedArticles() {
  const all = await getAllArticles();
  return all.filter((a) => a.featured).slice(0, 3);
}

// Get featured projects (max 3) — drafts already excluded by getAllProjects
export async function getFeaturedProjects() {
  const all = await getAllProjects();
  return all.filter((p) => p.featured).slice(0, 3);
}
