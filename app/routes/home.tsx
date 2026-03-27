import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { ContactStrip } from "~/components/common";
import {
  AboutStrip,
  CredentialsBar,
  Hero,
  WorkRows,
  WritingList,
} from "~/components/home";
import { GITHUB_URL, LINKEDIN_URL, SITE_URL } from "~/lib/constants";
import { getFeaturedArticles, getFeaturedProjects } from "~/lib/mdx.server";

export async function loader() {
  const [projects, articles] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedArticles(),
  ]);
  return { projects, articles };
}

const PAGE_TITLE = "Stephen Chiang — Design Technologist & Technology Leader";
const PAGE_DESCRIPTION =
  "Stephen Chiang — Design Technologist and Technology Leader. Product strategy, HMI, AI integration, and frontend engineering from Stavanger, Norway.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const OG_IMAGE_ALT = "Stephen Chiang — Design Technologist & Technology Leader";

/*
 * Homepage meta layer
 * 1. Core SEO       — title, description, keywords, author, robots, canonical
 * 2. Open Graph     — og:type, og:url, og:title, og:description, og:image,
 *                     og:site_name, og:locale
 * 3. Social cards   — twitter:card, twitter:title, twitter:description,
 *                     twitter:image (parsed by LinkedIn, Slack, and others)
 * 4. Structured data — Person JSON-LD (schema.org)
 * 5. AI signals     — theme-color, rel="me" identity verification, humans.txt
 *
 * Not in this function (already in root.tsx):
 *   - lang="en" belongs on <html> in root.tsx
 *   - viewport meta is in root.tsx
 */
export const meta: MetaFunction = () => [
  // ── 1. Core SEO ─────────────────────────────────────────────────────────
  { title: PAGE_TITLE },
  { name: "description", content: PAGE_DESCRIPTION },
  {
    name: "keywords",
    content:
      "Stephen Chiang, Design Technologist, Technology Leader, Product Strategy, CTO, Head of Product, Tech Lead, Principal Engineer, Human-Machine Interfaces, HMI, AI Integration, Design Systems, Frontend Engineering, React, TypeScript, Data Visualisation, Stavanger Norway",
  },
  { name: "author", content: "Stephen Chiang" },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: SITE_URL },

  // ── 2. Open Graph ────────────────────────────────────────────────────────
  { property: "og:type", content: "website" },
  { property: "og:url", content: SITE_URL },
  { property: "og:title", content: PAGE_TITLE },
  { property: "og:description", content: PAGE_DESCRIPTION },
  { property: "og:image", content: OG_IMAGE },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: OG_IMAGE_ALT },
  { property: "og:site_name", content: "Stephen Chiang" },
  { property: "og:locale", content: "en_US" },

  // ── 3. Social cards (parsed by LinkedIn, Slack, iMessage, and others) ───
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: PAGE_TITLE },
  { name: "twitter:description", content: PAGE_DESCRIPTION },
  { name: "twitter:image", content: OG_IMAGE },
  { name: "twitter:image:alt", content: OG_IMAGE_ALT },

  // ── 4. Structured data — Person (schema.org) ─────────────────────────────
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Stephen Chiang",
      jobTitle: "Design Technologist / Product & Technology Leader",
      description:
        "Senior technology and product leader bridging design, engineering, and business strategy. Specialises in Design Systems, Human-Machine Interfaces, and AI integration. 10 years US Army Special Operations — the source of his systems thinking and delivery discipline.",
      url: SITE_URL,
      sameAs: [LINKEDIN_URL, GITHUB_URL],
      knowsAbout: [
        "Design Systems",
        "Frontend Engineering",
        "Human-Machine Interfaces",
        "AI Integration",
        "Product Strategy",
        "Scrum",
        "React",
        "TypeScript",
        "Data Visualisation",
      ],
      workLocation: { "@type": "Place", name: "Stavanger, Norway" },
      nationality: "American",
    },
  },

  // ── 5. AI discoverability signals ────────────────────────────────────────
  // theme-color: --color-bg (#131313) per DESIGN.md PWA spec
  { name: "theme-color", content: "#131313" },
  { tagName: "link", rel: "me", href: LINKEDIN_URL },
  { tagName: "link", rel: "me", href: GITHUB_URL },
  { tagName: "link", rel: "author", href: "/humans.txt" },
];

export default function Home() {
  const { projects, articles } = useLoaderData<typeof loader>();

  return (
    <main>
      <Hero />
      <CredentialsBar />
      <WorkRows projects={projects} />
      <AboutStrip />
      <WritingList articles={articles} />
      <ContactStrip />
    </main>
  );
}
