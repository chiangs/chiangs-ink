import { useEffect, useMemo, useReducer, useRef } from "react";
import { Link, useLoaderData } from "react-router";
import Fuse from "fuse.js";
import type { Route } from "./+types/index";
import type { ProjectFrontmatter } from "~/types/content";
import { getAllProjects } from "~/lib/mdx.server";
import { createRipple } from "~/lib/ripple";
import { ITEM_STAGGER_S } from "~/lib/constants";

// ─── Page copy ───────────────────────────────────────────────────────────────

const PAGE_TITLE = "Work — Stephen Chiang";
const PAGE_DESCRIPTION =
  "Enterprise software, data platforms, and design systems across maritime, oil & gas, defence, and technology industries.";
const SECTION_LABEL = "SELECTED WORK";
const HEADLINE = "Work.";
const SUBHEADLINE =
  "A record of problems solved, systems built, and organisations changed.";
const PLACEHOLDER_SEARCH = "Search projects...";
const LABEL_ALL_INDUSTRIES = "All Industries";
const LABEL_ALL_SOLUTION_TYPES = "All Solution Types";
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

// ─── Style objects ────────────────────────────────────────────────────────────

const subHeadlineStyle = { maxWidth: "560px" };
const controlBarStyle = { padding: "24px 32px" };
const activeTagsBarStyle = { padding: "12px 24px" };
const emptyStateStyle = { margin: "80px auto" };

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

const MAX_TAGS = 3;
const MAX_METRICS = 3;

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
        state.selectedIndustries.some((ind) => p.industry?.includes(ind))
      );
    }

    if (state.selectedSolutionTypes.length > 0) {
      result = result.filter((p) =>
        state.selectedSolutionTypes.some((st) => p.solutionType?.includes(st))
      );
    }

    return result;
  }, [state.query, state.selectedIndustries, state.selectedSolutionTypes, fuse, projects]);

  const hasFilters =
    state.query.length > 0 ||
    state.selectedIndustries.length > 0 ||
    state.selectedSolutionTypes.length > 0;

  const activeTags = [
    ...state.selectedIndustries.map((v) => ({ kind: "industry" as const, value: v })),
    ...state.selectedSolutionTypes.map((v) => ({ kind: "solution" as const, value: v })),
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
          "-=0.3"
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
          "-=0.2"
        );
      }
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
        { opacity: 1, duration: 0.2, stagger: 0.04, ease: "power1.out" }
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

  return (
    <main>
      {/* Page header */}
      <div
        ref={headerRef}
        className="max-w-container mx-auto px-margin-mob md:px-margin pt-section-mob md:pt-section pb-12 md:pb-16"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent mb-4">
          {SECTION_LABEL}
        </p>
        <h1
          className="font-display font-bold text-text-primary leading-[0.9]"
          style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
        >
          {HEADLINE}
        </h1>
        <p
          className="font-body font-normal text-[18px] text-text-muted mt-4"
          style={subHeadlineStyle}
        >
          {SUBHEADLINE}
        </p>
      </div>

      {/* Control bar + active tags */}
      <div ref={controlBarRef}>
        <div className="bg-surface" style={controlBarStyle}>
          <div className="max-w-container mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {/* Search input */}
            <div className="relative flex items-center w-full md:w-[280px]">
              <SearchIcon />
              <input
                type="text"
                value={state.query}
                onChange={(e) =>
                  dispatch({ type: "SET_QUERY", payload: e.target.value })
                }
                onKeyDown={handleSearchKeyDown}
                placeholder={PLACEHOLDER_SEARCH}
                className="w-full bg-bg border-b border-border font-body font-normal text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                style={{ height: "40px", padding: "0 16px 0 28px", transition: "border-color var(--transition-fast)" }}
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex gap-3 md:ml-8">
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
            <div className="flex items-center md:ml-auto">
              <span className="font-body font-normal text-[12px] text-text-muted">
                {resultsLabel}
              </span>
              {hasFilters && (
                <button
                  onClick={handleClearAll}
                  className="font-body font-medium text-[12px] text-accent ml-4"
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
          <div className="bg-surface border-t border-bg" style={activeTagsBarStyle}>
            <div className="max-w-container mx-auto flex flex-wrap gap-2">
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
                  className="flex items-center gap-2 bg-surface-highest font-body font-medium text-[11px] text-accent uppercase tracking-[0.1em] px-[10px] py-1"
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
      <div ref={rowsContainerRef}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))
        ) : (
          <EmptyState onClear={handleClearAll} />
        )}
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type FilterDropdownProps = {
  label: string;
  defaultLabel: string;
  options: string[];
  selected: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleOption: (value: string) => void;
};

function FilterDropdown({
  label,
  defaultLabel,
  options,
  selected,
  isOpen,
  onToggleOpen,
  onToggleOption,
}: FilterDropdownProps) {
  const buttonLabel =
    selected.length > 0 ? `${label} (${selected.length})` : defaultLabel;
  const chevronClass = `ml-2 inline-block ${isOpen ? "rotate-180" : "rotate-0"}`;
  const chevronStyle = { transition: "transform var(--transition-fast)" };

  return (
    <div className="relative" data-dropdown>
      <button
        onClick={onToggleOpen}
        className="flex items-center bg-bg border-b border-border font-body font-medium text-[12px] text-text-muted uppercase tracking-[0.1em] px-3 whitespace-nowrap"
        style={{ height: "40px", transition: "color var(--transition-fast)" }}
      >
        {buttonLabel}
        <span className={chevronClass} style={chevronStyle}>
          ↓
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 bg-hover-surface border border-border min-w-[220px] mt-1">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            const optionClass = `flex items-center justify-between w-full text-left font-body font-normal text-[13px] px-4 py-[10px] ${
              isSelected ? "text-accent" : "text-text-primary"
            }`;
            return (
              <button
                key={option}
                onClick={() => onToggleOption(option)}
                className={optionClass}
                style={{ transition: "background var(--transition-fast)" }}
              >
                {option}
                {isSelected && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type ProjectRowProps = {
  project: ProjectFrontmatter;
  index: number;
};

const ghostNumberStyle = { fontSize: "120px", opacity: 0.08 };
const ghostNumberMobStyle = { fontSize: "72px", opacity: 0.08 };

function ProjectRow({ project, index }: ProjectRowProps) {
  const number = String(index + 1).padStart(2, "0");
  const displayTags = project.tags.slice(0, MAX_TAGS);
  const displayMetrics = project.metrics.slice(0, MAX_METRICS);
  const industryLabel = project.industry?.[0] ?? "";

  return (
    <Link
      to={`/work/${project.slug}`}
      className="work-row group relative flex items-center min-h-[120px] border-b border-border overflow-hidden"
      style={{
        padding: "0 24px",
        transition: "background var(--transition-fast)",
      }}
      data-cursor="view"
      onTouchStart={createRipple}
    >
      {/* Ghost number */}
      <span
        className="hidden md:block absolute left-[-10px] font-display font-bold text-accent select-none pointer-events-none leading-none group-hover:opacity-[0.16]"
        style={{ ...ghostNumberStyle, transition: "opacity var(--transition-fast)" }}
        aria-hidden
      >
        {number}
      </span>
      <span
        className="md:hidden absolute left-0 font-display font-bold text-accent select-none pointer-events-none leading-none"
        style={ghostNumberMobStyle}
        aria-hidden
      >
        {number}
      </span>

      {/* Zone 2: Title + tags */}
      <div className="flex-1 pl-[72px] md:pl-20 py-6">
        <span
          className="font-display font-bold text-text-primary group-hover:text-accent block"
          style={{
            fontSize: "clamp(18px, 4.5vw, 22px)",
            transition: "color var(--transition-fast)",
          }}
        >
          {project.title}
        </span>
        <div className="flex flex-wrap gap-[6px] mt-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="font-body font-medium text-[10px] text-text-muted uppercase tracking-[0.1em] border border-border px-2 py-[2px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Zone 3: Metrics — desktop only */}
      {displayMetrics.length > 0 && (
        <div className="hidden md:flex flex-col gap-1 w-[280px] py-6">
          {displayMetrics.map((m) => (
            <div key={m.label} className="flex items-baseline gap-2">
              <span className="font-display font-bold text-[16px] text-accent">
                {m.value}
              </span>
              <span className="font-body font-normal text-[11px] text-text-muted">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zone 4: Meta */}
      <div className="text-right min-w-[120px] py-6">
        <span className="font-display font-bold text-[13px] text-text-primary block">
          {project.year}
        </span>
        <span className="font-body font-medium text-[10px] text-text-muted uppercase tracking-[0.1em] block mt-1">
          {project.status}
        </span>
        {industryLabel && (
          <span className="hidden md:block font-body font-medium text-[10px] text-accent uppercase tracking-[0.1em] mt-1">
            {industryLabel}
          </span>
        )}
      </div>
    </Link>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={emptyStateStyle}
    >
      <p
        className="font-display font-light text-[24px] text-text-muted text-center"
      >
        {LABEL_NO_RESULTS}
      </p>
      <button
        onClick={onClear}
        className="font-body font-medium text-[14px] text-accent mt-4"
        style={{ transition: "opacity var(--transition-fast)" }}
      >
        {LABEL_CLEAR_FILTERS}
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-0 text-text-muted pointer-events-none"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 9.5L13 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
