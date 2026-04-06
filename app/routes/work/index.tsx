import { useEffect, useMemo, useReducer, useRef } from "react";
import { useLoaderData } from "react-router";
import { EmptyState, FilterDropdown, SearchIcon, WorkRow } from "~/components/common";
import { WorkInsightsPanel } from "~/components/work";
import { ITEM_STAGGER_S, SEARCH_INPUT_STYLE } from "~/lib/constants";
import { Fuse } from "~/lib/fuse";
import { getAllProjects } from "~/lib/mdx.server";
import { PatternCircles, PatternLines, PatternWaves } from "~/lib/visx";
import type { ProjectFrontmatter } from "~/types/content";
import type { Route } from "./+types/index";

// ─── Page copy ───────────────────────────────────────────────────────────────

const PAGE_TITLE = "Work — Stephen Chiang";
const PAGE_DESCRIPTION =
  "Enterprise software, data platforms, and design systems across maritime, oil & gas, defence, and technology industries.";
const SECTION_LABEL = "SELECTED WORK";
const HEADLINE = "Work.";
const PLACEHOLDER_SEARCH = "What are you interested in?";
const LABEL_ALL_INDUSTRIES = "Industries";
const LABEL_ALL_SOLUTION_TYPES = "Solution Types";
const LABEL_INDUSTRY = "Industry";
const LABEL_SOLUTION_TYPE = "Solution Type";
const LABEL_CLEAR_ALL = "Clear all →";
const LABEL_NO_RESULTS = "No projects match your search.";
const LABEL_CLEAR_FILTERS = "Clear filters →";

// ─── Filter options ───────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Maritime",
  "Oil & Gas / Energy",
  "Defence / Military",
  "Government / Public Sector",
  "Consulting & Professional Services",
  "Healthcare",
  "Technology / SaaS",
  "Retail / E-commerce",
  "Logistics / Supply Chain",
] as const;

const SOLUTION_TYPE_OPTIONS = [
  "Enterprise Software",
  "Data & Analytics Platforms",
  "Design Systems",
  "Web Applications",
  "Dashboards & Visualisation",
  "APIs & Integrations",
  "Internal Tooling",
  "Human-Machine Interfaces",
] as const;


// ─── Fuse config ──────────────────────────────────────────────────────────────

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "tags", weight: 0.3 },
    { name: "roles", weight: 0.2 },
  ],
  threshold: 0.3,
  includeScore: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type FilterState = {
  query: string;
  selectedIndustries: string[];
  selectedSolutionTypes: string[];
  industryOpen: boolean;
  solutionTypeOpen: boolean;
};

type FilterAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "TOGGLE_INDUSTRY"; payload: string }
  | { type: "TOGGLE_SOLUTION_TYPE"; payload: string }
  | { type: "TOGGLE_INDUSTRY_OPEN" }
  | { type: "TOGGLE_SOLUTION_TYPE_OPEN" }
  | { type: "CLOSE_DROPDOWNS" }
  | { type: "CLEAR_ALL" };

const initialState: FilterState = {
  query: "",
  selectedIndustries: [],
  selectedSolutionTypes: [],
  industryOpen: false,
  solutionTypeOpen: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "TOGGLE_INDUSTRY": {
      const exists = state.selectedIndustries.includes(action.payload);
      return {
        ...state,
        selectedIndustries: exists
          ? state.selectedIndustries.filter((i) => i !== action.payload)
          : [...state.selectedIndustries, action.payload],
      };
    }
    case "TOGGLE_SOLUTION_TYPE": {
      const exists = state.selectedSolutionTypes.includes(action.payload);
      return {
        ...state,
        selectedSolutionTypes: exists
          ? state.selectedSolutionTypes.filter((s) => s !== action.payload)
          : [...state.selectedSolutionTypes, action.payload],
      };
    }
    case "TOGGLE_INDUSTRY_OPEN":
      return {
        ...state,
        industryOpen: !state.industryOpen,
        solutionTypeOpen: false,
      };
    case "TOGGLE_SOLUTION_TYPE_OPEN":
      return {
        ...state,
        solutionTypeOpen: !state.solutionTypeOpen,
        industryOpen: false,
      };
    case "CLOSE_DROPDOWNS":
      return { ...state, industryOpen: false, solutionTypeOpen: false };
    case "CLEAR_ALL":
      return initialState;
    default:
      return state;
  }
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader() {
  const projects = await getAllProjects();
  return { projects };
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  return [
    { title: PAGE_TITLE },
    { name: "description", content: PAGE_DESCRIPTION },
  ];
}

// ─── Route component ──────────────────────────────────────────────────────────

export default function WorkIndex() {
  const { projects } = useLoaderData<typeof loader>();
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const headerRef = useRef<HTMLDivElement>(null);
  const controlBarRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(projects, FUSE_OPTIONS), [projects]);

  const filteredProjects = useMemo(() => {
    let result: ProjectFrontmatter[] = state.query
      ? fuse.search(state.query).map((r) => r.item)
      : [...projects];

    if (state.selectedIndustries.length > 0) {
      result = result.filter((p) =>
        p.industry !== undefined && state.selectedIndustries.includes(p.industry),
      );
    }

    if (state.selectedSolutionTypes.length > 0) {
      result = result.filter((p) =>
        state.selectedSolutionTypes.some((st) => p.solutionType?.includes(st)),
      );
    }

    return result;
  }, [
    state.query,
    state.selectedIndustries,
    state.selectedSolutionTypes,
    fuse,
    projects,
  ]);

  const hasFilters =
    state.query.length > 0 ||
    state.selectedIndustries.length > 0 ||
    state.selectedSolutionTypes.length > 0;

  const activeTags = [
    ...state.selectedIndustries.map((v) => ({
      kind: "industry" as const,
      value: v,
    })),
    ...state.selectedSolutionTypes.map((v) => ({
      kind: "solution" as const,
      value: v,
    })),
  ];

  const resultsLabel = hasFilters
    ? `${filteredProjects.length} results`
    : `${projects.length} projects`;

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
        const rows = rowsContainerRef.current.querySelectorAll(".work-row");
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
      gsap.set("#dots-pattern", { y: 40, opacity: 0 });
      tl = gsap.timeline({ delay: 0.2 });
      (tl as ReturnType<typeof gsap.timeline>)
        // All three animate simultaneously
        .to(
          "#chaos-clip-rect",
          { attr: { width: 1, height: 1 }, duration: 0.65, ease: "power2.out" },
          0,
        )
        .to(
          "#waves-clip-rect",
          { attr: { x: 0, width: 1 }, duration: 0.1, ease: "power1.inOut" },
          0,
        )
        .to(
          "#dots-pattern",
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
          0,
        );
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  // Filter transition — fade rows in when filteredProjects changes
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
      const rows = rowsContainerRef.current?.querySelectorAll(".work-row");
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
  }, [filteredProjects]);

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

  const projectsList =
    filteredProjects.length > 0 ? (
      filteredProjects.map((project, i) => (
        <WorkRow key={project.slug} project={project} index={i} />
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
              id="chaos-lines-1"
              height={100}
              width={100}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.5}
              orientation={["diagonal"]}
            />
            <PatternLines
              id="chaos-lines-2"
              height={20}
              width={20}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.5}
              orientation={["diagonalRightToLeft"]}
            />
            <PatternWaves
              id="wave-pattern"
              height={50}
              width={50}
              fill="transparent"
              stroke="var(--color-invert-bg)"
              strokeWidth={0.6}
            />
            <PatternCircles
              id="dot-grid"
              height={22}
              width={22}
              radius={1.7}
              fill="var(--color-invert-bg)"
            />
            <clipPath id="chaos-clip" clipPathUnits="objectBoundingBox">
              <rect id="chaos-clip-rect" x="0" y="0" width="0" height="0" />
            </clipPath>
            <clipPath id="waves-clip" clipPathUnits="objectBoundingBox">
              <rect id="waves-clip-rect" x="1" y="0" width="0" height="1" />
            </clipPath>
          </defs>
          {/* LEFT: Chaos — crosshatch */}
          <g clipPath="url(#chaos-clip)">
            <rect
              x="0"
              y="0"
              width="33.33%"
              height="100%"
              fill="url(#chaos-lines-1)"
            />
            <rect
              x="0"
              y="0"
              width="33.33%"
              height="100%"
              fill="url(#chaos-lines-2)"
            />
          </g>
          {/* MIDDLE: Transition — waves */}
          <rect
            x="33.33%"
            y="0"
            width="33.33%"
            height="100%"
            fill="url(#wave-pattern)"
            clipPath="url(#waves-clip)"
          />
          {/* RIGHT: Order — dot grid */}
          <rect
            id="dots-pattern"
            x="66.66%"
            y="0"
            width="33.34%"
            height="100%"
            fill="url(#dot-grid)"
          />
        </svg>
        <div className="relative z-1 max-w-container mx-auto px-margin-mob md:px-margin pt-section-mob md:pt-section pb-12 md:pb-16">
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

      {/* Insights panel — always receives all projects, not filtered subset */}
      <WorkInsightsPanel projects={projects} />

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
                label={LABEL_INDUSTRY}
                defaultLabel={LABEL_ALL_INDUSTRIES}
                options={INDUSTRY_OPTIONS as unknown as string[]}
                selected={state.selectedIndustries}
                isOpen={state.industryOpen}
                onToggleOpen={() => dispatch({ type: "TOGGLE_INDUSTRY_OPEN" })}
                onToggleOption={(v) =>
                  dispatch({ type: "TOGGLE_INDUSTRY", payload: v })
                }
              />
              <FilterDropdown
                label={LABEL_SOLUTION_TYPE}
                defaultLabel={LABEL_ALL_SOLUTION_TYPES}
                options={SOLUTION_TYPE_OPTIONS as unknown as string[]}
                selected={state.selectedSolutionTypes}
                isOpen={state.solutionTypeOpen}
                onToggleOpen={() =>
                  dispatch({ type: "TOGGLE_SOLUTION_TYPE_OPEN" })
                }
                onToggleOption={(v) =>
                  dispatch({ type: "TOGGLE_SOLUTION_TYPE", payload: v })
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
                        tag.kind === "industry"
                          ? "TOGGLE_INDUSTRY"
                          : "TOGGLE_SOLUTION_TYPE",
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

      {/* Project list */}
      <div
        ref={rowsContainerRef}
        className="max-w-container mx-auto md:px-margin"
      >
        {projectsList}
      </div>
    </main>
  );
}

