// currently.ts
// Content config for the Currently drawer.
// Edit this file to update the drawer — no component changes needed.

export type CurrentlyItem = {
  label: string;
  // Each string renders as a separate paragraph
  paragraphs: string[];
  // If set, this phrase is italicised inside the first paragraph
  bookTitle?: string;
};

export const CURRENTLY_TITLE = "Currently";

export const CURRENTLY_ITEMS: CurrentlyItem[] = [
  {
    label: "Training",
    paragraphs: [
      "Weight lifting, Muay Thai, and hiking.",
      "Currently trying to get lost in as many Norwegian fjords as possible.",
    ],
  },
  {
    label: "Building",
    paragraphs: [
      "Mechanical keyboards and custom PCs.",
      "The best way to understand how humans interact with machines is to build them yourself.",
    ],
  },
  {
    label: "Reading",
    bookTitle: "The UX of AI",
    paragraphs: [
      "The UX of AI — Greg Nudelman.",
      "Mid-way through the chapter on Digital Twins. The overlap with my current project work is uncomfortably well-timed.",
    ],
  },
  {
    label: "Life",
    paragraphs: [
      "Single father of three.",
      "Everything else fits around that.",
    ],
  },
  {
    label: "On my mind",
    paragraphs: [
      "How AI changes the roles of both the designer and the developer — not whether it will, but how fast, and whether either discipline is ready for it. And the question nobody is answering well yet: how do you actually measure whether an AI implementation is working?",
    ],
  },
];

export const CURRENTLY_FOOTER =
  "Updated periodically. Last updated March 2026.";
