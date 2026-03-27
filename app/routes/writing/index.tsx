import { useEffect, useMemo, useReducer, useRef } from "react";
import { useLoaderData } from "react-router";
import { EmptyState, FilterDropdown, SearchIcon, WritingRow } from "~/components/common";
import { WritingInsightsPanel } from "~/components/writing";
import { ITEM_STAGGER_S, SEARCH_INPUT_STYLE } from "~/lib/constants";
import { Fuse } from "~/lib/fuse";
import { getAllArticles } from "~/lib/mdx.server";
import { PatternCircles, PatternLines } from "~/lib/visx";
import type { ArticleFrontmatter } from "~/types/content";
import type { Route } from "./+types/index";

// ─── Page copy ────────────────────────────────────────────────────────────────

const PAGE_TITLE = "Writing — Stephen Chiang";
const PAGE_DESCRIPTION =
  "Thinking on design technology, data, AI, and the intersection of how products get built.";
const SECTION_LABEL = "SELECTED WRITING";
const HEADLINE = "Writing.";
const PLACEHOLDER_SEARCH = "What are you looking for?";
const LABEL_ALL_CATEGORIES = "Categories";
const LABEL_ALL_READ_TIMES = "Read Time";
const LABEL_CATEGORY = "Category";
const LABEL_READ_TIME = "Read Time";
const LABEL_CLEAR_ALL = "Clear all →";
const LABEL_NO_RESULTS = "No articles match your search.";
const LABEL_CLEAR_FILTERS = "Clear filters →";

// ─── Filter options ───────────────────────────────────────────────────────────

const READ_TIME_OPTIONS = [
  "Short (1–5 min)",
  "Medium (6–10 min)",
  "Long (11+ min)",
] as const;

// ─── Fuse config ──────────────────────────────────────────────────────────────

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "category", weight: 0.3 },
    { name: "tags", weight: 0.2 },
  ],
  threshold: 0.3,
  includeScore: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type FilterState = {
  query: string;
  selectedCategories: string[];
  selectedReadTimes: string[];
  categoryOpen: boolean;
  readTimeOpen: boolean;
};

type FilterAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "TOGGLE_READ_TIME"; payload: string }
  | { type: "TOGGLE_CATEGORY_OPEN" }
  | { type: "TOGGLE_READ_TIME_OPEN" }
  | { type: "CLOSE_DROPDOWNS" }
  | { type: "CLEAR_ALL" };

const initialState: FilterState = {
  query: "",
  selectedCategories: [],
  selectedReadTimes: [],
  categoryOpen: false,
  readTimeOpen: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "TOGGLE_CATEGORY": {
      const exists = state.selectedCategories.includes(action.payload);
      return {
        ...state,
        selectedCategories: exists
          ? state.selectedCategories.filter((c) => c !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    }
    case "TOGGLE_READ_TIME": {
      const exists = state.selectedReadTimes.includes(action.payload);
      return {
        ...state,
        selectedReadTimes: exists
          ? state.selectedReadTimes.filter((r) => r !== action.payload)
          : [...state.selectedReadTimes, action.payload],
      };
    }
    case "TOGGLE_CATEGORY_OPEN":
      return {
        ...state,
        categoryOpen: !state.categoryOpen,
        readTimeOpen: false,
      };
    case "TOGGLE_READ_TIME_OPEN":
      return {
        ...state,
        readTimeOpen: !state.readTimeOpen,
        categoryOpen: false,
      };
    case "CLOSE_DROPDOWNS":
      return { ...state, categoryOpen: false, readTimeOpen: false };
    case "CLEAR_ALL":
      return initialState;
    default:
      return state;
  }
}

// ─── Read time filter helper ──────────────────────────────────────────────────

function matchesReadTime(readTime: string, filter: string): boolean {
  const mins = parseInt(readTime, 10);
  if (isNaN(mins)) return false;
  if (filter === "Short (1–5 min)") return mins <= 5;
  if (filter === "Medium (6–10 min)") return mins > 5 && mins <= 10;
  if (filter === "Long (11+ min)") return mins > 10;
  return false;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader() {
  const articles = await getAllArticles();
  return { articles };
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  return [
    { title: PAGE_TITLE },
    { name: "description", content: PAGE_DESCRIPTION },
  ];
}

// ─── Route component ──────────────────────────────────────────────────────────

export default function WritingIndex() {
  const { articles } = useLoaderData<typeof loader>();
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const headerRef = useRef<HTMLDivElement>(null);
  const controlBarRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(articles, FUSE_OPTIONS), [articles]);

  // Derive categories dynamically from articles
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result: ArticleFrontmatter[] = state.query
      ? fuse.search(state.query).map((r) => r.item)
      : [...articles];

    if (state.selectedCategories.length > 0) {
      result = result.filter((a) =>
        state.selectedCategories.includes(a.category),
      );
    }

    if (state.selectedReadTimes.length > 0) {
      result = result.filter((a) =>
        state.selectedReadTimes.some((rt) => matchesReadTime(a.readTime, rt)),
      );
    }

    return result;
  }, [
    state.query,
    state.selectedCategories,
    state.selectedReadTimes,
    fuse,
    articles,
  ]);

  const hasFilters =
    state.query.length > 0 ||
    state.selectedCategories.length > 0 ||
    state.selectedReadTimes.length > 0;

  const activeTags = [
    ...state.selectedCategories.map((v) => ({
      kind: "category" as const,
      value: v,
    })),
    ...state.selectedReadTimes.map((v) => ({
      kind: "readTime" as const,
      value: v,
    })),
  ];

  const resultsLabel = hasFilters
    ? `${filteredArticles.length} results`
    : `${articles.length} articles`;

  // Load animation — runs once on mount
  useEffect(() => {
    let tl: { kill(): void } | null = null;
    let isMounted = true;
    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      tl = gsap.timeline();
      if (headerRef.current) {
        (tl as ReturnType<typeof gsap.timeline>).from(headerRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
      if (controlBarRef.current) {
        (tl as ReturnType<typeof gsap.timeline>).from(
          controlBarRef.current,
          { opacity: 0, duration: 0.4, ease: "power2.out" },
          "-=0.3",
        );
      }
      if (rowsContainerRef.current) {
        const rows = rowsContainerRef.current.querySelectorAll(".writing-row");
        (tl as ReturnType<typeof gsap.timeline>).from(
          rows,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: ITEM_STAGGER_S,
            ease: "power2.out",
          },
          "-=0.2",
        );
      }
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  // Pattern reveal animation — runs once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    let tl: { kill(): void } | null = null;
    let isMounted = true;
    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      gsap.set("#writing-dots-pattern", { y: 40, opacity: 0 });
      tl = gsap.timeline({ delay: 0.2 });
      (tl as ReturnType<typeof gsap.timeline>)
        .to(
          "#writing-diagonal-clip-rect",
          { attr: { width: 1, height: 1 }, duration: 0.65, ease: "power2.out" },
          0,
        )
        .to(
          "#writing-dots-pattern",
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
          0,
        )
        .to(
          "#writing-horizontal-clip-rect",
          { attr: { height: 1 }, duration: 0.7, ease: "power2.inOut" },
          0,
        );
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  // Filter transition — fade rows in when filteredArticles changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!rowsContainerRef.current) return;
    let tween: { kill(): void } | null = null;
    let isMounted = true;
    const animate = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      const rows = rowsContainerRef.current?.querySelectorAll(".writing-row");
      if (!rows?.length) return;
      tween = gsap.fromTo(
        rows,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, stagger: 0.04, ease: "power1.out" },
      );
    };
    animate();
    return () => {
      isMounted = false;
      tween?.kill();
    };
  }, [filteredArticles]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-dropdown]")) {
        dispatch({ type: "CLOSE_DROPDOWNS" });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") dispatch({ type: "SET_QUERY", payload: "" });
  };

  const handleClearAll = () => dispatch({ type: "CLEAR_ALL" });

  const articlesList =
    filteredArticles.length > 0 ? (
      filteredArticles.map((article, i) => (
        <WritingRow
          key={article.slug ?? i}
          article={article}
          index={i}
          variant="detailed"
        />
      ))
    ) : (
      <EmptyState
        noResultsLabel={LABEL_NO_RESULTS}
        clearFiltersLabel={LABEL_CLEAR_FILTERS}
        onClear={handleClearAll}
      />
    );

  return (
    <main>
      {/* Page header */}
      <div ref={headerRef} className="relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <PatternLines
              id="writing-diagonal-lines"
              height={20}
              width={20}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.5}
              orientation={["diagonal"]}
            />
            <PatternCircles
              id="writing-dot-grid"
              height={22}
              width={22}
              radius={1.7}
              fill="var(--color-invert-bg)"
            />
            <PatternLines
              id="writing-horizontal-lines"
              height={5}
              width={5}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.2}
              orientation={["horizontal"]}
            />
            <clipPath
              id="writing-diagonal-clip"
              clipPathUnits="objectBoundingBox"
            >
              <rect
                id="writing-diagonal-clip-rect"
                x="0"
                y="0"
                width="0"
                height="0"
              />
            </clipPath>
            <clipPath
              id="writing-horizontal-clip"
              clipPathUnits="objectBoundingBox"
            >
              <rect
                id="writing-horizontal-clip-rect"
                x="0"
                y="0"
                width="1"
                height="0"
              />
            </clipPath>
          </defs>
          {/* LEFT: Diagonal lines — raw thought, ideas being captured */}
          <rect
            x="0"
            y="0"
            width="33.33%"
            height="100%"
            fill="url(#writing-diagonal-lines)"
            clipPath="url(#writing-diagonal-clip)"
          />
          {/* MIDDLE: Dots grid — discrete ideas, being organised and distilled */}
          <rect
            id="writing-dots-pattern"
            x="33.33%"
            y="0"
            width="33.33%"
            height="100%"
            fill="url(#writing-dot-grid)"
          />
          {/* RIGHT: Horizontal lines — clean linear prose, knowledge communicated */}
          <rect
            x="66.66%"
            y="0"
            width="33.34%"
            height="100%"
            fill="url(#writing-horizontal-lines)"
            clipPath="url(#writing-horizontal-clip)"
          />
        </svg>
        <div className="relative z-[1] max-w-container mx-auto px-margin-mob md:px-margin pt-section-mob md:pt-section pb-12 md:pb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent mb-4">
            {SECTION_LABEL}
          </p>
          <h1
            className="font-display font-bold text-text-primary leading-[0.9]"
            style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
          >
            {HEADLINE}
          </h1>
        </div>
      </div>

      {/* Writing insights panel */}
      <WritingInsightsPanel articles={articles} />

      {/* Control bar + active tags */}
      <div ref={controlBarRef}>
        <div className="bg-surface py-4 md:py-6">
          <div className="max-w-container mx-auto px-margin-mob md:px-margin flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
            {/* Search input */}
            <div className="relative flex items-center w-full md:w-70">
              <SearchIcon />
              <input
                type="text"
                value={state.query}
                onChange={(e) =>
                  dispatch({ type: "SET_QUERY", payload: e.target.value })
                }
                onKeyDown={handleSearchKeyDown}
                placeholder={PLACEHOLDER_SEARCH}
                className="w-full bg-bg border-b border-border font-body font-normal text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                style={SEARCH_INPUT_STYLE}
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 md:ml-8">
              <FilterDropdown
                label={LABEL_CATEGORY}
                defaultLabel={LABEL_ALL_CATEGORIES}
                options={categories}
                selected={state.selectedCategories}
                isOpen={state.categoryOpen}
                onToggleOpen={() => dispatch({ type: "TOGGLE_CATEGORY_OPEN" })}
                onToggleOption={(v) =>
                  dispatch({ type: "TOGGLE_CATEGORY", payload: v })
                }
              />
              <FilterDropdown
                label={LABEL_READ_TIME}
                defaultLabel={LABEL_ALL_READ_TIMES}
                options={READ_TIME_OPTIONS as unknown as string[]}
                selected={state.selectedReadTimes}
                isOpen={state.readTimeOpen}
                onToggleOpen={() => dispatch({ type: "TOGGLE_READ_TIME_OPEN" })}
                onToggleOption={(v) =>
                  dispatch({ type: "TOGGLE_READ_TIME", payload: v })
                }
              />
            </div>

            {/* Results count + clear */}
            <div className="flex items-center mt-1 md:mt-0 md:ml-auto">
              <span className="font-body font-normal text-sm text-text-muted">
                {resultsLabel}
              </span>
              {hasFilters && (
                <button
                  onClick={handleClearAll}
                  className="font-body font-medium text-sm text-accent ml-4"
                  style={{ transition: "opacity var(--transition-fast)" }}
                >
                  {LABEL_CLEAR_ALL}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {activeTags.length > 0 && (
          <div className="bg-surface border-t border-bg py-3">
            <div className="max-w-container mx-auto px-margin-mob md:px-margin flex flex-wrap gap-2">
              {activeTags.map((tag) => (
                <button
                  key={`${tag.kind}-${tag.value}`}
                  onClick={() =>
                    dispatch({
                      type:
                        tag.kind === "category"
                          ? "TOGGLE_CATEGORY"
                          : "TOGGLE_READ_TIME",
                      payload: tag.value,
                    })
                  }
                  className="flex items-center gap-2 bg-surface-highest font-body font-medium text-xs text-accent uppercase tracking-[0.1em] px-2.5 py-1"
                  style={{ transition: "background var(--transition-fast)" }}
                >
                  {tag.value}
                  <span className="text-text-muted">×</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article rows */}
      <div
        ref={rowsContainerRef}
        className="max-w-container mx-auto md:px-margin"
      >
        {articlesList}
      </div>
    </main>
  );
}

