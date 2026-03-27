# DESIGN.md — Stephen Chiang Personal Site
# Feed this file into every Claude build conversation.
# It is the single source of truth for all design decisions.

---

## Identity

Name:       Stephen Chiang
Title:      Design Technologist / Product & Technology Leader
Tagline:    Engineering the strategy behind how products get built
Sub-title:  Leading a national practice integrating design,
            data, and technology. Available for senior technology
            and product leadership roles.
Descriptor: Design Technology · Product Strategy ·
            Human-Machine Interfaces · AI Design & Integration
Email:      stephen@chiang.studio
            NOTE: Email is NOT displayed publicly on the site.
            Contact is via the contact form or LinkedIn only.
Location:   Stavanger, Norway
Timezone:   CET (Europe/Oslo)
Domain:     www.chiang.ink  ← CANONICAL. Never use "chiangs.ink" (wrong).
            SITE_URL in ~/lib/constants.ts must always be "https://www.chiang.ink"
LinkedIn:   linkedin.com/in/chiangs
Social:     LinkedIn + GitHub only — X/Twitter removed from all pages.

Positioning:
  Primary audience:   Hiring managers for CTO, Head of Product,
                      Tech Lead, Principal Engineer roles
  Secondary audience: Consulting clients at enterprise/agency level
  Key differentiator: Senior technology leader who speaks design,
                      engineering, data, and business strategy —
                      without switching modes
  Military note:      10 years US Army Special Operations —
                      referenced as the source of systems thinking
                      and delivery discipline, not as the headline

---

## Color Tokens

NOTE: Where Stitch's system and ours conflicted, our locked
decisions take precedence. Stitch's superior principles
(no-line rule, tonal stacking, ambient shadows) are adopted.

--color-bg:               #131313   /* Primary background — Stitch's
                                       denser charcoal, not pure black */
--color-surface:          #1a1a1a   /* Section lift */
--color-surface-low:      #161616   /* Subtle tonal shift — replaces
                                       border lines for separation */
--color-surface-high:     #202020   /* Elevated surface — cards on hover */
--color-surface-highest:  #2a2a2a   /* Highest elevation — modals */
--color-card:             #1a1a1a   /* Cards, form areas */
--color-invert-bg:        #D97707   /* Inverted section background —
                                       Stitch's copper primary_container */
--color-invert-text:      #0c0c0c   /* Text on inverted section */
--color-text-primary:     #E5E2E1   /* Primary text — Stitch's warmer
                                       off-white, papery feel */
--color-text-muted:       #737371   /* Muted / secondary text */
--color-accent:           #FFB77D   /* Stitch's copper primary — warm,
                                       ember-like. ONLY accent color. */
--color-accent-deep:      #D97707   /* Stitch's primary_container —
                                       used for CTA gradients + active */
--color-border:           #222220   /* Used sparingly — code blocks,
                                       ghost borders only */
--color-border-accent:    #FFB77D   /* Featured / active borders */
--color-ghost-border:     rgba(85,67,54,0.15)  /* Ghost border fallback
                                       for technical boundaries only */
--color-hover-surface:    #1e1e1e   /* Work row hover background */

VISUALIZATION PALETTE (used sparingly in charts only — not UI chrome):
  --color-viz-orange:  #FF9A3C   /* Solid stream 1 — primary */
  --color-viz-teal:    #00E5C7   /* Solid stream 2 */
  --color-viz-blue:    #4DA6FF   /* Solid stream 3 */
  --color-viz-pink:    #F472B6   /* Patterned stream 4 */
  --color-viz-purple:  #A78BFA   /* Patterned stream 5 */
  --color-viz-green:   #34D399   /* Patterned stream 6 */
  These values are canonical — STREAM_COLORS in WritingInsightsPanel.tsx
  must stay in sync with these tokens.
  Defined in app.css @theme. Import as Tailwind class or CSS var.
  Rule: do not use viz palette colors in UI chrome, buttons, or text.
        Exception: --gradient-viz may be used as a text gradient on
        key stat values (e.g. Avg. Time to MVP in InsightsPanel).

  VISUALIZATION GRADIENT:
  --gradient-viz: linear-gradient(90deg, #FF9A3C, #00E5C7, #4DA6FF)
  Used on: Avg. Time to MVP number value in InsightsPanel
  Applied as: background-clip text fill (WebkitTextFillColor: transparent)

ACCENT GRADIENT (Stitch's "Copper Lead" — for primary CTAs):
  background: linear-gradient(135deg, #FFB77D, #D97707)
  Mimics the sheen of polished metal.
  Use on: primary buttons, featured section borders,
          key metric numbers.

THE NO-LINE RULE (from Stitch — adopted):
  Never use 1px solid borders for sectioning or containment.
  Section boundaries are defined by tonal surface shifts:
    surface → surface-low or surface-high
  Negative space is a structural element — increase spacing
  before reaching for a divider line.
  EXCEPTION: ghost borders on code blocks (#222220 at 15% opacity)
  and the 4px accent left borders on pull quotes / callouts.

---

## Typography

Display font:   Space Grotesk (Google Fonts)
                Weights used: 300 (light) and 700 (bold)
                Used for: hero headline, section titles,
                ghost numbers, pull quotes
                The geometric nature reinforces the
                "Design Technologist" persona.

Body font:      Manrope (Google Fonts)
                Weights used: 400 (regular) and 500 (medium)
                Used for: body copy, UI labels, captions
                Provides humanist balance to Space Grotesk's
                geometric precision.

Label style:    Manrope 500, 14px, uppercase,
                letter-spacing: 0.15em

Minimum font size: 14px — no text anywhere on the site should
                render below 14px.
                Exception: tag pills (work row tags, filter tags)
                may use 12px — they are dense UI elements where
                14px creates visual imbalance.

Type scale:
  --text-tag:     12px  / Manrope 500 / uppercase / ls 0.1em  (exception)
  --text-label:   14px  / Manrope 500 / uppercase / ls 0.15em
  --text-caption: 14px  / Manrope 400
  --text-body:    16px  / Manrope 400 / lh 1.75
  --text-body-lg: 18px  / Manrope 400 / lh 1.75
  --text-sub:     20px  / Manrope 400
  --text-h3:      24px  / Manrope 600
  --text-h2:      32px  / Space Grotesk 700
  --text-h1:      clamp(48px, 7vw, 80px) / Space Grotesk 700
  --text-display: clamp(72px, 11vw, 120px) / Space Grotesk 300+700
  --text-ghost:   160px / Space Grotesk 700 / opacity 8%

Google Fonts import (in root.tsx):
  Space Grotesk: weights 300, 700
  Manrope: weights 400, 500, 600

ALIGNMENT RULES (from Stitch — adopted):
  Never center-align headlines in editorial layouts.
  Center feels like a template. Use left-aligned or
  staggered asymmetric columns.
  Indented asymmetry: titles at left margin, body copy
  indented further right to create dynamic editorial flow.

EXTREME WEIGHT CONTRAST (from Stitch — adopted):
  Space Grotesk 300 (light) next to 700 (bold)
  creates immediate high-end tension.
  This IS the visual identity — not decoration.
  Apply throughout: hero headline, section openers,
  writing page title treatment.

IMAGE CAPTIONS (from Stitch — adopted):
  All image captions use technical reference style:
  "REF_001 // SCALE 1:1" format
  Manrope 500, 14px, uppercase, #FFB77D
  Positioned bottom-right, overlapping image edge slightly.

---

## Spacing

Base unit:          8px
Section padding:    120px vertical (desktop) / 72px (mobile)
Container max:      1280px
Side margins:       80px (desktop) / 24px (mobile)
Card padding:       40px (desktop) / 24px (mobile)
Row padding:        32px vertical per work row

HORIZONTAL ALIGNMENT RULE (all sections — work index page):
  All content inner wrappers use:
    max-w-container mx-auto px-margin-mob md:px-margin
  This aligns all left edges — header label, insights panel,
  search bar, and work rows — at exactly 80px from the
  container edge on desktop, 24px on mobile.
  Full-bleed backgrounds (bg-surface, bg-bg) remain on outer
  wrappers with no horizontal padding. Content constraint is
  purely on the inner wrapper.

---

## Borders, Radius & Depth

Border radius:      0px everywhere — cards, buttons,
                    inputs, images, all elements. No exceptions.

THE NO-LINE RULE:   Never use borders for sectioning.
                    Use tonal surface shifts instead.
                    See Color Tokens for surface scale.

Ghost border:       rgba(85,67,54,0.15) — only for code blocks
                    and technically required outlines. Should be
                    felt, not seen.

Accent border:      1px solid #f5a020 — featured elements only
Featured left:      4px solid #f5a020 — pull quotes, challenge
                    callouts, active TOC items

THE STACKING RULE (depth without shadows):
                    Place surface-highest (#2a2a2a) over
                    surface-low (#161616) for perceived lift.
                    Tonal contrast creates elevation, not borders.

Ambient shadow:     Only for floating elements (modals, drawers)
                    box-shadow: 0 24px 48px rgba(0,0,0,0.4)
                    Must feel like natural light falloff,
                    never a hard drop shadow.

Glassmorphism:      Nav on scroll, tooltips only
                    background: rgba(19,19,19,0.8)
                    backdrop-filter: blur(20px)

---

## Component Patterns

NAV
  Position:     sticky top, transparent bg
                On scroll: rgba(19,19,19,0.8) + backdrop-filter blur(20px)
  Logo:         "SC" — Space Grotesk 700, #FFB77D, 16px
  Links:        Manrope 500, 11px, uppercase, ls 0.15em, #E5E2E1
  Order:        ABOUT · WORK · WRITING · CONTACT
  Active:       #FFB77D underline, scaleX(0)→scaleX(1) from left
  Time display: Manrope 500, 11px, uppercase, #737371
                Shows Stavanger time (Europe/Oslo)
                Clicking triggers Currently drawer
  Mobile:       Hamburger menu (☰) left of SC monogram
                Full-screen overlay, slides in from right
                Links: Space Grotesk 700, clamp(48px,10vw,64px)
                Left-aligned, 32px left padding, 48px gap between
                SC monogram top left, ✕ close top right

HERO (homepage)
  Layout:       split — text left 55%, portrait right 45%
  Eyebrow:      "DESIGN TECHNOLOGIST // PORTFOLIO 2026"
                Manrope 500, 11px, #FFB77D, uppercase, ls 0.15em
  Headline L1:  "Engineering" — Space Grotesk 300 (light),
                clamp(72px, 11vw, 120px), #E5E2E1
  Headline L2:  "design." — Space Grotesk 700 (bold),
                same size, #FFB77D
  Sub-headline: "Leading delivery." — Manrope 400, 20px, #737371
  Bottom strip: "DESIGN TECHNOLOGIST · UX ENGINEER · PRODUCT LEAD"
                Manrope 500, 11px, #737371, uppercase, ls 0.15em
  Scroll label: "SCROLL TO EXPLORE ↓" — Manrope 500, 11px, #FFB77D

PORTRAIT (homepage hero — desktop)
  filter:   grayscale(100%) contrast(1.35) brightness(0.85)
  overlay:  rgba(255,183,125,0.65) mix-blend-mode multiply
  grain:    SVG feTurbulence at 5% opacity
  fade:     gradient to transparent starting at 60% height
  caption:  "REF_016 // PORTRAIT" + "ISO 400 // 85MM"
            Manrope 500, 10px, uppercase, #E5E2E1 50% opacity
            position: bottom right, overlaid on portrait
  vertical: "STEPHEN CHIANG © 2026" rotated 90deg clockwise
            right edge, Manrope 500, 10px, #737371, ls 0.2em

PORTRAIT (homepage hero — mobile)
  Layout:     Full-bleed below text, 50vh height
  Crop:       object-position: center 35%
              Tight chest-up crop, face prominent,
              minimal bar background visible
  filter:     grayscale(100%) contrast(1.2) brightness(1.0)
  overlay:    rgba(255,160,50,0.75) mix-blend-mode multiply
              More saturated than desktop — dramatic amber wash
  Top fade:   linear-gradient #131313 0%→40%, transparent 100%
              Blends text section into portrait seamlessly
  Bottom fade:transparent 0% → #131313 100%, height 200px
  Section bg: var(--color-bg-portrait) / #c97a20 — matches portrait so image bleeds edge to edge
  Vertical text: hidden on mobile
  Caption:    hidden on mobile

PORTRAIT (about page)
  Shape:      Circle clip-path, full colour (no duotone/grayscale)
  Desktop:    w-211px h-211px, beside headline in hero row
              drop-shadow: 5 layers, 1–10px, rgba(0,0,0,0.4–1.0)
  Mobile:     w-96px h-96px, centered, above bio text paragraphs
              Same drop-shadow treatment, tighter spread
  Crop:       object-position: center 30%
  Animation:  Simple fade in on load (no clip-path wipe)
  B&W reveal: None — full colour always

BIO TEXT HIGHLIGHTS (about page)
  Phrase:     "single integrated discipline" → #D97707 (accent-deep)
  Phrase:     "doesn't show up on a Figma file" → #D97707 (accent-deep)
  Treatment:  Inline <span class="text-accent-deep"> — no bold/italic

ALL OTHER IMAGES
  Duotone: highlights → #E5E2E1, shadows → #0E0E0E
  Grain:   5% SVG feTurbulence overlay on all work images
  Caption: "REF_001 // SCALE 1:1" style — see Typography
  Container: 0px radius, no border box

WORK ROWS
  Ghost number: 160px Space Grotesk 700, #FFB77D, opacity 8%
  Project name: 36–40px Space Grotesk 700, #E5E2E1
  Category tag: 11px Manrope 500 caps, #737371, right-aligned
                white-space: nowrap, text-overflow: ellipsis
  Outcome:      13px Manrope 400, #737371, right-aligned
                max-width: 300px, truncated with ellipsis
  Divider:      1px solid #222220 bottom only
                NO outer container border
  Min-height:   110px, align-items: center (flexbox)
  Hover:        background → #1e1e1e
                project name → #FFB77D
                ghost opacity → 18%
                transition: all 0.2s ease
                data-cursor="view" — custom cursor expands
  Implementation: CSS :hover pseudo-class preferred over JS state
  Mobile:       font-size: clamp(20px, 5vw, 28px) on title
                Category + outcome stack below title
                Ghost number: 80px
                padding: 24px 16px, no fixed min-height

WORK INDEX PAGE (routes/work/index.tsx)
  Page header:
    Layout:   position: relative, overflow: hidden
              Full-bleed pattern SVG background (position: absolute,
              inset: 0, width/height 100%, preserveAspectRatio: none)
              Text content constrained to max-w-container mx-auto
              px-margin-mob md:px-margin
    Label:    "SELECTED WORK" — Manrope 500, 11px, #FFB77D,
              uppercase, ls 0.15em
    Headline: "Work." — Space Grotesk 700, clamp(56px, 8vw, 96px), #E5E2E1
    No subheadline — removed

  Header background pattern (SVG — three equal segments, full bleed):
    Left third — Chaos: crosshatch (two overlapping PatternLines,
      diagonal + diagonalRightToLeft, stroke: var(--color-invert-bg),
      strokeWidth 0.5, height/width 100/20)
    Middle third — Transition: PatternWaves
      (stroke: var(--color-invert-bg), strokeWidth 0.6,
      height/width 50)
    Right third — Order: PatternCircles
      (fill: var(--color-invert-bg), radius 1.7, height/width 22)
    No fade or gradient between segments — hard edges
    Pattern components: @visx/pattern via ~/lib/visx.ts
      Exports: PatternWaves, PatternLines, PatternCircles

  Header pattern reveal animation (GSAP, client-side only):
    Technique:  Opaque cover rects (#131313) placed over each
                segment in the SVG render tree. GSAP animates them
                away on load — NOT clip-path animation on <defs>
                elements (those do not respond to CSS transforms).
    Trigger:    useEffect, typeof window !== 'undefined' guard
    Delay:      0.2s before timeline starts
    All three segments animate simultaneously (position: 0 in timeline)
    Chaos cover:  scaleX: 1→0, scaleY: 1→0,
                  transformOrigin: "0% 0%" (top-left corner),
                  duration 0.7s, ease power2.out, opacity 1→0
    Waves cover:  scaleX: 1→0,
                  transformOrigin: "100% 50%" (right edge, reveals left→right),
                  duration 0.55s, ease power1.inOut, opacity 1→0
    Dots cover:   attr.y animates from 0 → large pixel value (slides down),
                  duration 0.55s, ease power2.out, opacity 1→0
                  Effect: dots appear rendered, then slide down off-screen
                  (opposite of "slide up to reveal" — the content itself exits)
    Cleanup:    tl.kill() in useEffect return

  Insights panel (InsightsPanel component — above control bar):
    Background: #1a1a1a (bg-surface), full bleed
    Inner content: max-w-container mx-auto px-margin-mob md:px-margin
    Padding: 32px vertical
    Toggle row: "WORK INSIGHTS" label (#FFB77D, Manrope 500, 11px,
                uppercase, ls 0.15em) + "Hide ↑"/"Show ↓"
    Toggle button "Hide ↑"/"Show ↓" text:
                accent-glow-pulse CSS animation (see Motion System)
                Pulses between #737371 (muted) and #FFB77D (accent)
                with text-shadow glow, 2.4s ease-in-out infinite
    Sub-label: "N projects across X industries."
               Manrope 400, 12px, #737371
    Default: expanded (desktop), collapsed (mobile)
    Collapse/expand: GSAP height tween 0.4s power2.inOut
      Collapse: gsap.set height=scrollHeight, overflow=hidden,
                then gsap.to height=0
      Expand:   set overflow=hidden, then gsap.to height=auto,
                clear overflow on complete
    isAnimating guard: ref prevents double-tap during tween
    animationKey: integer state incremented on every expand —
                  passed as prop to all child visualisations so
                  they restart animations each time panel opens
    Always receives ALL projects (not filtered subset)
    Layout — 3-column × 2-row grid:
      Row 1, Col 1: INDUSTRY PROPORTION — Waffle chart
        10×10 = 100 cells, industry proportion by project count
        Cell: 14×14px, 2px gap, 0px radius
        Colors: industry-mapped to accent scale
        Legend: below chart, color swatch + name + %
        Animation: diagonal wave bottom-left → upper-right
          (see Motion System → WaffleChart)
      Row 1, Col 2: PROJECT ACTIVITY — Calendar heatmap
        @visx/heatmap HeatmapRect
        Years (columns) × Months (rows)
        Filled cells: #FFB77D at varying opacity by count
        Empty cells: #1a1a1a (surface)
      Row 1, Col 3: WORK CONNECTIONS — Network graph
        @visx/network Graph + d3-force simulation
        Nodes: projects + shared tags/roles
        Edges: connections between shared attributes
        Simulation: frozen after 200 ticks (simulation.stop()
          before tick loop — CRITICAL for performance)
        No continuous animation — static layout after init
        Animation: links fade in, nodes pop in with scale
          (see Motion System → NetworkGraph)
      Row 2, Col 1–2 (span-2): TECH STACK — Treemap
        @visx/hierarchy Treemap + treemapSquarify
        d3.hierarchy for data structure
        Height: 200px fixed
        Cells labeled with tech name, #FFB77D if count≥2
        Animation: stagger left-to-right by x-position
          (see Motion System → TechTreemap)
      Row 2, Col 3: AVG. TIME TO MVP — Stat
        Number: Space Grotesk 700, 48px, #FFB77D
        Sub-label: "months to MVP" — Manrope 400, 14px, #737371
        Computed from metrics where label contains "month" or "MVP"
        Animation: counts DOWN from ~3× the real value to the real
          value (see Motion System → AvgMVPStat)
    All charts: bg #131313 cells, 20px cell padding
    Chart labels: Manrope 500, 10px, #737371
    SSR guard: mounted state (useState + useEffect) — all charts
      render only after mount (client-side only)
    Responsive widths: useParentSize from @visx/responsive
    Data: computeInsights useMemo — derived from all projects
    MDX frontmatter additions (for charts):
      industries: string[]  (mirrors industry field)
      stack: { frameworks, languages, platforms } string arrays
    Mobile: single column, panel collapsed by default

  Control bar:
    Background: #1a1a1a (bg-surface), full bleed
    Inner content: max-w-container mx-auto px-margin-mob md:px-margin
    Padding: 24px vertical
    Three zones in one row (stacks vertically on mobile):
      Left:   Search input, width 280px (full-width mobile), height 40px
              Underline-only border (#222220), bg #131313
              Search icon (SVG magnifier, 14px, #737371) absolute left
              padding 0 16px 0 32px (32px left clears icon), clears on ESC
              Placeholder: "What are you interested in?"
      Middle: Two multi-select filter dropdowns (gap 12px), height 40px
              Industry + Solution Type
              Trigger: bg #131313, border-bottom #222220, Manrope 500, 12px
              Panel: bg #1e1e1e, border #222220, min-width 220px
              Selected options: #FFB77D + ✓ checkmark right-aligned
              Stays open until outside click
              One dropdown closes when the other opens
      Right:  "[n] projects" or "[n] results" + "Clear all →" when active
              Manrope 400/500, 12px, #737371 / #FFB77D

  Active filter tags row (below control bar, shown when any filter active):
    Background: #1a1a1a, border-top #131313
    Inner content: max-w-container mx-auto px-margin-mob md:px-margin
    Tags: bg #2a2a2a, Manrope 500, 11px, #FFB77D, uppercase, ls 0.1em
    × removes individual tag; clicking tag also removes it

  Project rows container:
    max-w-container mx-auto px-margin-mob md:px-margin
    (ensures rows left-align with header, insights panel, search bar)

  Project row layout (4 zones):
    Zone 1: Ghost number — Space Grotesk 700, 120px (desktop) / 72px (mobile)
            #FFB77D, opacity 8% → 16% on hover, absolute left-[-10px]
    Zone 2: Title (clamp 18–28px, Space Grotesk 700) + tags (max 3)
            Title → #FFB77D on row hover
    Zone 3: Metrics (max 3) — desktop only, hidden on mobile
            Value: Space Grotesk 700, 16px, #FFB77D
            Label: Manrope 400, 11px, #737371
    Zone 4: Year + Status (+ Industry on desktop) — right-aligned

  Empty state:
    "No projects match your search." — Space Grotesk 300, 24px, #737371
    "Clear filters →" — Manrope 500, 14px, #FFB77D, below

  Search + filter logic:
    Fuse.js — keys: title (0.5), tags (0.3), roles (0.2), threshold 0.3
    Filter order: fuse → industry → solutionType (AND logic)
    State managed via useReducer (5 pieces of state)

  Animations:
    Load: header slides up 24px + fades, control bar fades (−0.3s), rows stagger
    Filter change: rows fade in 0.2s with 0.04s stagger (GSAP)
    Header pattern: cover rect reveal, all segments simultaneous, 0.2s delay

WRITING INDEX PAGE (routes/writing/index.tsx)
  Page header:
    Layout:   Same structure as Work index — position: relative,
              overflow: hidden, full-bleed pattern SVG background
              Text constrained to max-w-container mx-auto
              px-margin-mob md:px-margin
    Label:    "SELECTED WRITING" — Manrope 500, 11px, #FFB77D,
              uppercase, ls 0.15em
    Headline: "Writing." — Space Grotesk 700,
              clamp(56px, 8vw, 96px), #E5E2E1

  Header background pattern (SVG — same three-segment treatment
    as Work index: Chaos → Transition → Order using @visx/pattern)

  Insights panel (WritingInsightsPanel component):
    Background:   #1a1a1a (bg-surface), full bleed
    Inner content: max-w-container mx-auto px-margin-mob md:px-margin
    Padding:      32px vertical
    Toggle row:   "WRITING INSIGHTS" label + "Hide ↑"/"Show ↓"
    Toggle button "Hide ↑"/"Show ↓" text:
                  accent-glow-pulse CSS animation (see Motion System)
                  Identical treatment to Work InsightsPanel toggle
    Sub-label:    "N articles. Writing focus over time."
                  Manrope 400, 12px, #737371
    Default:      expanded (desktop), collapsed (mobile)
    Collapse/expand: GSAP height tween 0.4s power2.inOut
      Same pattern as Work InsightsPanel — gsap.set + gsap.to,
      overflow managed, isAnimating guard ref
    animationKey: integer state incremented on expand —
                  passed to WritingStreamgraph to restart animation
    Always receives ALL articles (not filtered subset)
    Content:      WritingStreamgraph (see below)
    Insufficient data guard: return null when < 2 quarters OR < 4 articles
                             (no placeholder — the panel simply does not render)

  WritingStreamgraph (inside WritingInsightsPanel):
    Type:         Streamgraph — @visx/shape AreaStack
    X axis:       Quarterly time buckets (e.g. "Q1 2024")
    Streams:      Article tags (each article contributes +1 to every tag)
    Subtitle:     "Writing focus over time — by tag"
                  Manrope 400, 12px, #737371
    Stack offset: stackOffsetWiggle + stackOrderInsideOut (canonical streamgraph)
                  Wiggle minimises slope, produces organic bidirectional flow
    Y domain:     Pre-computed via d3Stack() before passing to AreaStack —
                  required because wiggle produces negative y values
    Curve:        curveBasis — smooth organic flow
    Colors:       Top 3 tags (by frequency) → solid streams
                  Remaining tags → patterned streams (textured fills)
    Solid colors: #FF9A3C (orange), #00E5C7 (teal), #4DA6FF (blue)
                  fillOpacity 1, stroke: none
    Patterned:    Base fills from design system surface shades:
                  index 3 → base: #2a2a2a, pattern: #3a3a38
                  index 4 → base: #222220, pattern: #333330
                  index 5 → base: #1e1e1e, pattern: #2a2a2a
                  index 6+ → base: #1a1a1a, pattern: #222220
                  Base layer opacity 0.9, pattern layer opacity 0.5,
                  stroke: none
    Draw order:   Patterned streams rendered first (bottom),
                  solid streams rendered last (top) — two-pass render
    Patterns:     @visx/pattern PatternLines (diagonal, horizontal),
                  PatternCircles — imported via ~/lib/visx.ts
    Legend:       Below chart, horizontal flex-wrap
                  Solid: color swatch
                  Patterned: swatch with baseFill bg, 1px patternColor outline
    Responsive:   useParentSize from @visx/responsive
    SSR guard:    mounted state — client-side only
    Animation:    See Motion System → Streamgraph

  Control bar (writing):
    Same structure as Work index control bar
    Search input: "What are you looking for?"
                  Uses shared SearchIcon + SEARCH_INPUT_STYLE
    Filters:      Category (multi-select), Read time (multi-select)
    Result count: "[n] articles" / "[n] results" + "Clear all →"
    State:        useReducer (search, category filter, readTime filter,
                  dropdown open state, mounted) — 5+ pieces of state

  Writing rows:
    See WRITING LIST component pattern for full spec.
    Container: max-w-container mx-auto px-margin-mob md:px-margin

  Empty state:
    Shared EmptyState component from ~/components/common
    Labels: "No articles match your search." + "Clear filters →"

SHARED COMMON COMPONENTS (~/components/common/)
  ButtonCta:
    Props:       to (string href), children (ReactNode)
    Element:     React Router <Link> styled as a button
    Background:  linear-gradient(135deg, #FFB77D, #D97707) — copper gradient
    Text:        #0c0c0c (invert-text), Space Grotesk 700, 14px,
                 uppercase, letter-spacing 0.1em
    Padding:     16px 32px
    Radius:      0px — no exceptions
    Hover:       background inverts to #131313 (bg), text → #FFB77D
                 transition: all 0.2s ease
    Used in:     not-found.tsx (404 page CTA — "← Back to home")

  Toast:
    Position:    fixed bottom-8 left-1/2 translateX(-50%) — centered
    z-index:     50
    Background:  #1a1a1a (surface), 1px solid #222220 border
    Text:        Manrope 400, 14px, #E5E2E1
    Padding:     12px 20px
    Radius:      0px
    Dismiss:     × button, Manrope 500, 16px, #737371
    Animation:   CSS opacity 0→1 + translateY 8px→0 on show;
                 reverse on dismiss, 0.2s ease
    Context:     ToastContext in ~/lib/toast.tsx (show/dismiss actions)
    Hook:        useToast in ~/hooks/useToast.ts
    Provider:    mounted in _layout.tsx wrapping all routes
    Used for:    Navigation hint nudges — shown after nav count
                 thresholds 3 and 5 (stored in localStorage)

  SearchIcon:
    14×14px SVG magnifier (circle + line), currentColor
    className="absolute left-2.5 text-text-muted pointer-events-none"
    aria-hidden
    Used in: Work index search input, Writing index search input

  EmptyState:
    Props: noResultsLabel, clearFiltersLabel, onClear
    Layout: flex-col items-center justify-center my-20 mx-auto
    Headline: font-display font-light text-2xl text-text-muted text-center
    Button:   font-body font-medium text-sm text-accent mt-4
    Used in: Work index, Writing index

  SEARCH_INPUT_STYLE (~/lib/constants.ts):
    height: "40px", padding: "0 16px 0 32px",
    transition: "border-color var(--transition-fast)"
    Used in: Work index search, Writing index search

404 PAGE (routes/not-found.tsx)
  Variant:      Random on mount — one of three canvas visualisations
                Cycling: inline "click here" button picks a different one
  Meta:         noindex, nofollow — never indexed
  Copy:
    Eyebrow:    "ERROR // 404" — Manrope 500, 14px, #FFB77D, uppercase, ls 0.15em
    Headline:   "Page" (Space Grotesk 300, light) + "not found." (#FFB77D, bold)
                clamp(48px, 7vw, 80px)
    Body:       "This URL doesn't exist. Possibly never did. Head somewhere
                more useful, or [click here] to see a different visualisation."
                Manrope 400, 16px, #737371, lh 1.75, max-width md
                "click here" — inline <button>, text-text-primary, underline,
                hover → text-accent, transition 0.2s
    CTA:        ButtonCta → "/" — "← Back to home"

  Desktop layout (12-column grid):
    Text column:  cols 1–7, row-start-1, z-10, pt-80 pb-section
    Graph variant:   text px-margin both sides (no gap on section)
                     right panel cols 5–12 (intentional text overlap), py-[25%]
    Heatmap/Treemap: text pl-margin only (no pr), section gap-0
                     right panel cols 7–12, self-start, pt-80, pr-margin

  Right panel — graph variant:
    Component:  NetworkGraph404 — fills parent absolutely
    Panel:      cols 5–12, row-start-1, z-0, py-[25%]
    Ghost "404": Space Grotesk 700, clamp(120px,22vw,240px), #FFB77D, opacity 6%
                 position: absolute, top: -0.15em, left: -0.04em
                 Only shown for graph variant

  Right panel — heatmap variant:
    Component:  Heatmap404 — inside 2:1 aspect-ratio wrapper
    Wrapper:    width 100%, aspectRatio: "2 / 1"
    Panel:      cols 7–12, row-start-1, self-start, pt-80, pr-margin

  Right panel — treemap variant:
    Component:  Treemap404 — inside 2:1 aspect-ratio wrapper
    Same wrapper + panel layout as heatmap variant

  Mobile layout:
    Text column full width, stacked
    Compact visualisation panel: 200px fixed height, md:hidden
    Sits between body text and ButtonCta
    All three variants supported — canvas fills full width

  NetworkGraph404 (app/components/common/404/NetworkGraph404.tsx):
    Pure RAF — no physics library
    ~60 nodes (#FFB77D), ~90 links
    30% dead nodes — dim pulse (alpha 0.12±0.1, sin wave)
    50% dead links — flicker (opacity 0↔0.55, random intervals)
    Live nodes: alpha 0.88; live links: opacity 0.45
    Node glow halo: r×2.8, alpha×0.12
    Physics: repulsion 1600, spring rest 100, spring K 0.008,
             damping 0.93, centre pull 0.0005, max speed 1.8,
             drift 0.025, bounds push 0.4, bounds pad 32px
    Canvas: position absolute inset 0, fills parent
    Label: "GRAPH_404 // CONNECTION LOST" — rotated 90°, bottom-right
           right: 64px, bottom: 64px; hidden on mobile

  Heatmap404 (app/components/common/404/Heatmap404.tsx):
    Grid: 48 cols × 24 rows, 2px gap
    Aspect ratio: 2:1 wrapper → cells are exact squares
    Ghost: "404" — Space Grotesk 700, size min(w×0.55, 200px),
           #FFB77D opacity 10%, centered behind cells
    Cell states (4):
      dead (12%):       static alpha 0.03
      pulse (50%):      sin wave alpha 0.04–0.18, slow (speed 0.3–1.0)
      semi-glitch (25%): sin wave alpha 0.08–0.42, fast (speed 1.2–2.4)
      glitch (~13%):    flicker alpha 0.04 ↔ glitchPeak (0.5–0.95 per cell)
                        on: 1–12 frames random, off: 30–90 frames random
    Canvas: full width on mobile (label hidden); w-[calc(100%-28px)]
            offset right-7 on desktop to leave space for label
    Label: "DATA // NOT FOUND" — rotated 90°, right: 16px, bottom: 0
           hidden on mobile (md:block only)

  Treemap404 (app/components/common/404/Treemap404.tsx):
    Algorithm: squarify (pure TypeScript — no d3/visx)
    Data (7 items):
      Wrong turn 28% — accent
      Rogue link 22% — accent
      Cosmic misalignment 18%
      Operator error 14%
      Aggressive clicking 10%
      Expired bookmark 5%
      Unknown forces 3%
    Accent cells: rgba(255,183,125,0.22) fill + 1px copper border
                  Labels: #FFB77D
    Non-accent:   #1a1a1a fill, labels rgba(115,115,113,1)
    Labels: Manrope 500, 11px, 8px padding; % shown if cell height > 48px
            Only shown if cell width > 50px
    Visual gap: 1px INSET each side → 2px between adjacent cells
    Animation: see Motion System → Treemap404
    Canvas: same responsive sizing as Heatmap404
    Label: "ROOT CAUSE ANALYSIS // INCONCLUSIVE" — rotated 90°,
           right: 16px, bottom: 0; hidden on mobile

ABOUT STRIP (inverted section)
  Background:   #FFB77D (copper accent — confirmed via color dropper)
  All text:     #0c0c0c
  Ghost element: "020" — NOT "001"
                Space Grotesk 700
                font-size: clamp(160px, 20vw, 240px)
                opacity: 0.10, color: #0c0c0c
                position: absolute, left: -20px
                Bleeds off left edge — intentional
                "020" echoes the 20+ years in the copy
  Body text:    Manrope 400/500, 18–20px
  "I speak all of them." — Space Grotesk 700, 40–48px
                The dominant visual element of the section
  Mobile:       Ghost "020": clamp(80px, 18vw, 120px), opacity 0.08

MAP (Industries section — about page)
  Library:      D3.js, geoNaturalEarth1 projection
  Data:         world-atlas countries-110m.json
  Base:         transparent — non-highlighted countries
                match page background, creating cutout effect
  Highlighted:  #FFB77D copper — Norway, USA, Denmark,
                South Korea, Laos, Sri Lanka, Maldives, Iraq
  Container:    #1a1a1a surface — provides subtle frame
  Hover:        highlighted countries → #D97707 on hover
  Caption:      "8 countries across 4 continents"
                Manrope 400, 12px, #737371, italic

WRITING LIST
  Ghost number: Space Grotesk 700, opacity 8%, #FFB77D
                Always 3 digits — padStart(3, "0") (001, 002, ... 010, ...)
                Desktop: 120px, absolute left-[-10px], hidden md:block
                Mobile:  72px, absolute left-[-8px], md:hidden
                (Same dual-span pattern as Work rows)
  Title:        28–32px Space Grotesk 700, #E5E2E1
  Meta:         11px Manrope 500 caps, #737371
                Format: "CATEGORY · MON YYYY · X MIN"
  Hover:        title → #FFB77D
                4px left bar in #FFB77D slides in from left
                NO background lift (different from Work rows)
                data-cursor="read" — cursor shows "READ →"
  Mobile:       font-size: clamp(18px, 4.5vw, 24px) on title
                Meta stacks below title, left-aligned
                padding: 24px 16px

PULL QUOTE
  Font:         Space Grotesk 300, 36px, italic, #E5E2E1
  Left border:  4px solid #FFB77D
  Background:   #1a1a1a
  Padding:      32px

CODE BLOCK
  Background:   #1a1a1a
  Border:       rgba(85,67,54,0.15) ghost border
  Padding:      24px
  Syntax:       #FFB77D for highlights
  Copy button:  10px Manrope caps, #FFB77D, top-right

CHALLENGE CALLOUT
  Background:   #1a1a1a
  Left border:  4px solid #FFB77D
  Padding:      32px
  Text:         22px Manrope 600, #E5E2E1

METRICS STRIP
  Number:       Space Grotesk 700, 56px, #FFB77D
  Label:        Manrope 400, 13px, #737371
  Separator:    tonal surface shift, no divider lines

CONTACT STRIP (homepage)
  Headline:     "The right problem. The right partnership."
                Space Grotesk 700, #E5E2E1, no colour split
                Animates in two parts — "The right problem."
                first, "The right partnership." 400ms later
  Body:         "Open to the right full-time leadership roles
                and consulting partnerships. If the problem
                sits at the intersection of design, data,
                and technology — let's talk."
                Manrope 400, 16px, #737371, max-width 480px
                Fades in 300ms after headline completes
  CTAs:         "Contact form →" links to /contact
                "LinkedIn →" links to LinkedIn, new tab
                Both: Manrope 500, 14px, #FFB77D
                Stagger in 300ms after body, 150ms between links
  Email:        NOT displayed — contact via form or LinkedIn only
  Padding:      120px vertical

CONTACT FORM (contact page)
  Inputs:       underline only — 1px solid #FFB77D bottom,
                no background, no border box
  Labels:       10px Manrope 500, uppercase, #737371
  Button:       full width, gradient #FFB77D→#D97707, #0c0c0c text,
                Space Grotesk 700, uppercase, 0px radius
  Hover:        bg inverts — #0c0c0c bg, #FFB77D text

FOOTER
  Content:      "STEPHEN CHIANG [year]" left
                Easter egg hint center
                "GITHUB · LINKEDIN" right
                "LINKEDIN" right (LinkedIn only — no X)
                (+ "Style Guide ↗" in #FFB77D after unlocked)
  Style:        Manrope 500, 11px, uppercase, ls 0.15em, #737371
  Border:       1px solid #222220 top
  Easter hint:  "This site has secrets. Explore to find them."
                Manrope 400, 10px, #2a2a2a
                Reveals to #737371 on hover — cursor: default
  Mobile:       Stack vertically: name → hint → LinkedIn
                padding: 24px
                text-align: left throughout

NAV — EASTER EGG INTERACTIONS
  SC monogram:  On homepage — clicking triggers style guide drawer
                On other pages — navigates to homepage
  Live time:    Clicking triggers "Currently" drawer
                Shows Stavanger time (Europe/Oslo timezone)
                Format: HH:MM CET

CURRENTLY DRAWER (easter egg — time display click)
  Trigger:      Click live time display in nav
  Animation:    Slides in from right, 0.45s cubic-bezier(0.16,1,0.3,1)
  Width:        min(420px, 90vw) / 100vw on mobile
  Background:   #1a1a1a
  Border:       1px solid #FFB77D left edge (drawer outer only)
  Persistence:  No localStorage — resets each visit
  Content file: app/lib/currently.ts (edit here to update)
  Sections:
    TRAINING    Strength, Muay Thai, and hiking.
                Currently trying to get lost in as many
                Norwegian fjords as possible.
    READING     The UX of AI — Greg Nudelman.
                Mid-way through the chapter on Digital Twins.
                The overlap with my current project work
                is uncomfortably well-timed.
    BUILDING    Mechanical keyboards and custom PCs.
                The best way to understand how humans
                interact with machines is to build
                them yourself.
    LIFE        Single father of three.
                Everything else fits around that.
    ON MY MIND  How AI changes the roles of both the designer
                and the developer — not whether it will,
                but how fast, and whether either discipline
                is ready for it.
                And the question nobody is answering well yet:
                how do you actually measure whether an AI
                implementation is working?
  Block style:  Card — background #1e1e1e, padding 20px 24px
                No left border on blocks
                Gap between blocks: 12px
  Block hover:  scale(1.03) + drop-shadow(0 6px 20px rgba(0,0,0,0.6))
                transform: 0.35s cubic-bezier(0.34,1.56,0.64,1) (spring)
                filter: 0.3s ease
  Label:        10px Manrope 500, uppercase, #737371
  Body:         16px Manrope 400, #E5E2E1, lh 1.75
  Footer:       "Updated periodically. Last updated March 2026."
                Manrope 400, 11px, #737371

STYLE GUIDE DRAWER (easter egg — SC monogram click on homepage)
  Trigger:      Click SC monogram when already on homepage
  Animation:    Same as Currently drawer
  Width:        min(600px, 92vw) / 100vw on mobile
  Background:   #131313
  Border:       1px solid #FFB77D left edge
  Persistence:  localStorage key "sc-styleguide-unlocked"
                On first open: shows unlock message
                After unlock: "Style Guide ↗" appears in footer
  Unlock msg:   "You found it." — Space Grotesk 700, 24px, #FFB77D
                "The design system behind this site.
                A link has been added to the footer
                so you can return whenever you like."
                Manrope 400, 14px, #737371
  Sections:     Color palette swatches with hex + token name
                Typography scale (live rendered samples)
                Spacing system (token name / value table)
                Motion principles (listed with values)
                Build stack: React Router v7 · Tailwind v4 ·
                GSAP · Space Grotesk · Manrope · Vercel

---

## PWA & Favicon

Favicon:        /public/favicon.svg
                "SC" — Inter 900, #E5E2E1 on #131313 background
                4px #FFB77D orange underline bar at bottom
                Pure SVG — no font dependency issues
                512×512 viewBox, scales to all sizes

PWA setup:      manifest.json — create in IDE
                Required icons: 192×192, 512×512 PNG
                (generate from favicon.svg via realfavicongenerator.net)
                apple-touch-icon: 180×180 PNG
                Theme color: #131313
                Background color: #131313
                Display: standalone
                Start URL: /

root.tsx links:
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }
  { rel: "icon", type: "image/png", href: "/favicon-32.png" }
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
  { rel: "manifest", href: "/manifest.json" }

---

## Motion System

Load sequence (homepage):
  1. 0.0s — "SC" nav fades in
  2. 0.2s — hero eyebrow slides up + fades in
  3. 0.4s — "Engineering" slides up 20px, fades in, 0.6s ease-out
  4. 0.5s — "design." slides up 20px, fades in, 0.6s ease-out
  5. 0.7s — subtext fades in
  6. 0.9s — portrait fades in
  7. 1.1s — nav links fade in left to right, 40ms stagger

Scroll reveals:
  Trigger:      GSAP ScrollTrigger, start: "top 85%"
  Animation:    translateY(30px) → translateY(0) + opacity 0 → 1
  Duration:     0.6s ease-out
  Stagger:      200ms between sibling elements
  once: true    fires once, stays visible

Contact strip animation (scroll-triggered, once):
  0.0s  "The right problem." — slides up + fades in
  0.6s  "The right partnership." — slides up + fades in
  0.9s  Body text — fades in only (no y movement)
  1.2s  "Contact form →" — slides up + fades in
  1.35s "LinkedIn →" — slides up + fades in

Hover — work rows:
  Background:   #1e1e1e, transition 0.2s ease
  Title color:  #FFB77D, transition 0.2s ease
  Ghost number: opacity 8% → 18%, transition 0.2s ease
  Implementation: CSS :hover pseudo-class (not JS state)

Hover — writing rows:
  Left bar:     4px #FFB77D, scaleX(0)→scaleX(1), 0.2s ease
  Title color:  #FFB77D, transition 0.2s ease
  No background lift — different from work rows, intentional

Hover — nav links:
  Underline:    scaleX(0) → scaleX(1), transform-origin left,
                0.25s ease-out

Hover — buttons:
  Invert:       background/color swap, transition 0.2s ease

WORK INDEX — Header pattern reveal (on page load):
  Technique:    Cover rects (fill #131313) layered over each pattern
                segment. Animated away simultaneously on load.
  Chaos:        scaleX+scaleY 1→0 from top-left, 0.7s, power2.out
                + opacity 1→0
  Waves:        scaleX 1→0 from right edge (reveals left→right),
                0.55s, power1.inOut + opacity 1→0
  Dots:         attr.y 0→large offset (slides down off-screen),
                0.55s, power2.out + opacity 1→0
  All three:    Start simultaneously at position 0 in GSAP timeline
  Delay:        0.2s before timeline starts
  Guard:        typeof window !== 'undefined'

WRITING INDEX — Streamgraph animation (on mount + on expand, client-side only):
  Technique 1 — Clip scan reveal:
    SVG <clipPath> containing a <rect> with width animated 0 → full width
    AreaStack Group wrapped in clipPath="url(#stream-chart-clip)"
    Axis Group is NOT clipped (labels always visible)
    gsap.fromTo rect attr.width: 0 → chartWidth
    Duration: 1.8s, ease: power2.inOut
  Technique 2 — Stream stagger fade+rise:
    .stream-path class on all AreaStack path elements
    gsap.set: opacity 0, y: 6
    gsap.to: opacity 1, y: 0, duration 0.7s, stagger 0.12s,
             ease power2.out, delay 0.1s
  Re-animation: animationKey prop — animation useEffect depends on
                animationKey, so every panel expand triggers a fresh run
  Guard: isMounted flag + typeof window !== 'undefined'
  Cleanup: tweens array — forEach t.kill() in useEffect return

WORK INDEX — InsightsPanel chart animations (GSAP, client-side only):
  All charts re-animate every time the panel is expanded.
  Pattern: animationKey integer prop incremented on expand,
           each chart useEffect depends on animationKey.
  Guard: isMounted flag + typeof window !== 'undefined'
  Cleanup: tweens array — forEach t.kill() in useEffect return

  TechTreemap (left-to-right stagger by x-position):
    Target:   [data-treemap-x] leaf cell <rect> elements
    Sort:     Sorted ascending by data-treemap-x attr value
    Initial:  opacity 0, scaleY 0, transformOrigin "50% 100%"
    Animate:  opacity 1, scaleY 1, ease back.out(1.4)
    Stagger:  stagger: { amount: 0.6s } distributed across all cells
    Delay:    0.1s

  WaffleChart (diagonal wave, bottom-left → upper-right):
    Grid:     10 × 10 (WAFFLE_COLS × WAFFLE_ROWS)
    Key:      data-diagonal={col + (WAFFLE_ROWS - 1 - row)} on each <rect>
              Bottom-left cell has highest key, top-right has lowest —
              sorting by key ascending = bottom-left → upper-right order
    Target:   [data-diagonal] <rect> elements sorted by attr value
    Initial:  opacity 0, scale 0, transformOrigin "50% 50%"
    Animate:  opacity 1, scale 1, ease back.out(1.4)
    Stagger:  stagger: { amount: 0.8s } distributed across all cells
    Delay:    0.15s
    Complete: clearProps "opacity,transform,transformOrigin" restores
              SVG attribute-based hover dimming
    Note:     clearProps is critical — GSAP inline style.opacity would
              mask the SVG opacity attribute used for hover dim effect

  NetworkGraph (links fade + nodes scale in):
    Links:    [data-network-link] <line> elements
              gsap.fromTo opacity: 0 → 0.5, duration 0.4s, stagger 0.03s
    Nodes:    Inner [data-network-node] <g> wrapper inside outer
              translate <g> — outer handles position, inner handles scale
              gsap.fromTo scale: 0 → 1, opacity: 0 → 1
              ease back.out(1.4), duration 0.4s, stagger 0.04s, delay 0.2s
              svgOrigin "0 0" / transformOrigin "0px 0px"
    Re-animation guard: lastAnimatedKey ref (not hasAnimated bool)
              Animates when lastAnimatedKey.current !== animationKey
              Prevents resize from re-triggering animation while
              still allowing expand to re-trigger it

  AvgMVPStat (count-down number animation):
    Start:    Math.ceil(avgMVP * 3) — approximately 3× the real value
    End:      avgMVP — the real computed value
    Object:   const counter = { value: start }
              gsap.to(counter, { value: end, ... })
    Update:   onUpdate sets display state to Math.round(counter.value)
    Duration: 1.2s, ease power2.out
    Hydration: useState initialized with finalDisplay (real value)
               to match SSR; useEffect resets to start then animates
    Cleanup:  tween ref — tween?.kill() in useEffect return

404 PAGE — Canvas animations (pure requestAnimationFrame, no GSAP):
  All three variants use ResizeObserver for responsive canvas sizing.
  All guard against SSR: typeof window !== 'undefined' in useEffect.
  isMounted flag prevents state updates after unmount.

  NetworkGraph404 (continuous physics simulation):
    RAF loop runs every frame — no idle stopping
    stepPhysics(): repulsion + spring + centre gravity + drift per frame
    stepFlicker(): dead links lerp toward targetOpacity (step 0.1)
    drawLinks(): copper rgba, lineWidth 0.5, skip opacity < 0.01
    drawNodes(): glow halo (r×2.8, alpha×0.12) + core circle
    dt clamped: min(dt/16.67, 2.5) to handle tab-switch lag spikes

  Heatmap404 (per-frame cell state updates):
    stepGlitch(): decrements glitchTimer each frame; on expiry toggles
                  glitchOn and randomises next duration
    drawGhost():  "404" text in copper at 10% opacity, drawn before cells
    drawCells():  per-cell alpha computed each frame from state + timestamp
    Semi-glitch alpha: 0.08 + 0.34 × (0.5 + 0.5 × sin(ts × 0.001 × speed + phase))
    Pulse alpha:  0.04 + 0.14 × (0.5 + 0.5 × sin(ts × 0.001 × speed + phase))

  Treemap404 (one-shot stagger animation):
    squarify() runs once on init and on resize (only when dimensions change)
    xRankMap: tiles sorted by x then y → integer rank → stagger delay
    startFrame = xRank × STAGGER_FRAMES (6 frames per rank step)
    progress = easeOutCubic(clamp((frame - startFrame) / ANIM_FRAMES, 0, 1))
    ANIM_FRAMES = 18, easeOutCubic = 1 − (1−t)³
    drawH = ih × progress — clip rect grows from top down
    ctx.clip() constrains fill + border + labels to revealed area
    frame counter increments every RAF tick; RAF continues indefinitely
    (progress stays 1 after animation completes — no wasted redraws)

ACCENT GLOW PULSE (toggle button — both InsightsPanels):
  Target:   "Hide ↑" / "Show ↓" <span> in both InsightsPanel
            and WritingInsightsPanel toggle buttons
  Class:    .accent-glow-pulse (in app/app.css)
  Keyframes: @keyframes accent-glow-pulse
    0%/100%: color var(--color-text-muted), text-shadow: none
    50%:     color var(--color-accent), text-shadow: 0 0 12px rgba(255,183,125,0.5)
  Duration: 2.4s, ease-in-out, infinite
  Implementation: pure CSS — no GSAP

CURSOR FOLLOWER (desktop only):
  Behaviour:    Hybrid — native cursor visible everywhere
                EXCEPT over [data-cursor] elements
  Default:      8px circle, #FFB77D, 60ms lag
                position: fixed, pointer-events: none
                requestAnimationFrame for smooth movement
  Expanded:     56px circle, #FFB77D
                Label: Manrope 500, 9px, #131313, white-space: nowrap
                transition: width/height 0.3s ease
  data-cursor="view" → work rows → "VIEW →"
  data-cursor="read" → writing index rows → "READ →"
  Article page related articles: default trailing dot (no data-cursor)
  Touch check:  pointer: coarse || ontouchstart ||
                navigator.maxTouchPoints > 0 → return null

RIPPLE EFFECT (touch/mobile only):
  Trigger:      onTouchStart on work rows + writing rows
  Origin:       Exact tap position within element
  Color:        rgba(255, 183, 125, 0.25)
  Animation:    scale(0) → scale(2.5), opacity → 0, 0.6s
  Utility:      app/lib/ripple.ts — createRipple()
  Desktop:      Does not fire on mouse events

Portrait parallax:
  Rate:         0.6x scroll rate
  Library:      GSAP ScrollTrigger, scrub: true

About strip reveal:
  Animation:    clip-path wipes in left to right
  Duration:     0.6s ease-out, once: true

---

## Tech Stack

Framework:    React Router v7 (framework mode)
Styling:      Tailwind CSS v4
Animation:    GSAP + ScrollTrigger
Fonts:        Space Grotesk via Google Fonts (weights 300, 700)
              Manrope via Google Fonts (weights 400, 500, 600)
              No local font files — CDN only
CMS:          MDX files in /content directory
MDX:          @mdx-js/rollup + @mdx-js/react
Deploy:       Vercel (vercelPreset() in react-router.config.ts)

Third-party library wrappers (~/lib/):
  ~/lib/visx.ts   — @visx/* static re-exports
                    scaleLinear, scalePoint, scaleBand
                    PatternWaves, PatternLines, PatternCircles
                    HeatmapRect, hierarchy, Treemap,
                    treemapSquarify, Graph, useParentSize
                    AreaStack, AxisBottom
                    curveBasis, stackOffsetWiggle,
                    stackOrderInsideOut, d3Stack (from d3-shape)
  ~/lib/fuse.ts   — fuse.js static re-export (Fuse, IFuseOptions)
  ~/lib/d3.ts     — async loadD3() for d3 + topojson-client
                    async loadD3Force() for d3-force
  RULE: Never import directly from third-party packages in
        components or routes. Always route through ~/lib/.

---

## Build Order

1.  Project setup + Tailwind + fonts
2.  Favicon + PWA manifest
3.  Shared components — Nav, Footer
4.  Easter egg components — CurrentlyDrawer, StyleGuideDrawer
5.  Root layout — _layout.tsx wiring all drawers
6.  Homepage — Hero, Work rows, About strip,
    Writing list, Contact strip
7.  ✓ Work index page — COMPLETE
8.  Project page template
9.  ✓ Writing index page — COMPLETE
10. Article page template
11. Contact page
12. ✓ 404 page — COMPLETE (3 canvas variants: graph, heatmap, treemap)
13. MDX loader + /content directory wiring
14. Content — drop in MDX files
15. Motion layer — GSAP scroll triggers + cursor follower
16. Portrait duotone — CSS filter stack
17. PWA offline support — service worker
18. Deploy to Vercel

---

## Content Inventory

PROJECTS (MDX in /content/work/)
  maritime-intelligence-platform.mdx
    — Global maritime services provider, Norway
    — Full-stack web app + Snowflake data strategy
    — Roles: Product Owner, Scrum Lead, Tech Lead, Frontend Lead
    — Stack: React Router v7, BFF → .NET → Snowflake
    — Metrics: 200+ users, 300+ vessels, 5 months, 2 legacy apps sunsetted
    — AI angle: data structured and positioned for future AI experiences
    — industries: ["Maritime"]
    — stack: { frameworks: ["React Router v7", "TypeScript"],
               languages: ["TypeScript", "SQL"],
               platforms: ["Snowflake", ".NET", "Vercel"] }

  enterprise-data-governance-ai-readiness.mdx
    — Anonymous global oil & gas major
    — Data landscape mapping + governance strategy + tooling assessment
    — Role: Design Technologist (service design team)
    — Focus: federated governance model, AI-ready master data management
    — No hard metrics — scope and client scale carry the proof
    — industries: ["Oil & Gas / Energy"]
    — stack: { frameworks: ["Service Design"],
               languages: [],
               platforms: ["Snowflake", "Collibra"] }

  maritime-operations-financial-intelligence.mdx
    — Anonymous maritime operator
    — Internal B2B dashboard — operational + financial analysis
    — Roles: Tech Lead, Frontend Lead, Design Lead
    — Stack: Remix v2 / React
    — Metrics: 4 months to MVP
    — Notable: waffle charts, maps with near-real time updates,
               bar charts, typographic hierarchy as visualisation tool
    — industries: ["Maritime"]
    — stack: { frameworks: ["Remix v2", "React", "D3.js"],
               languages: ["TypeScript"],
               platforms: ["Tailwind CSS", "Vercel"] }

ARTICLES (MDX in /content/writing/)
  dashboards-are-not-for-overview.mdx
    — Category: Data & AI
    — 8 min read
    — Core argument: dashboards shorten distance between data and decision,
                     not to provide overview
    — Framework: three gaps (data, sense-making, decision)

  design-is-creation-with-researched-intent.mdx
    — Category: Design Technology
    — 7 min read
    — Core argument: design and development are the same activity
                     with the audience priority flipped
    — Key insight: user first → team → functionality (design)
                   architecture first → team → user (development)

COPY — LOCKED AND FINAL
  Hero eyebrow:     "DESIGN TECHNOLOGIST // PORTFOLIO 2026"
  Hero headline:    "Engineering" (Space Grotesk 300)
                    "design." (Space Grotesk 700, #FFB77D)
  Hero sub:         "Leading delivery."
  Hero descriptor:  "DESIGN TECHNOLOGIST · UX ENGINEER · PRODUCT LEAD"

  About strip headline:
    "Most organisations don't hire a Design Technologist.
    They hire a CTO, a Tech Lead, a Head of Product, or
    a Strategy Consultant — and they get someone who only
    speaks one language."
  About strip punch:
    "I speak all of them." (Space Grotesk 700, 40–48px)
  About strip body:
    "20+ years leading product development at the critical
    intersection of people, process, and technology.
    Currently building the next generation of data and
    AI-driven digital experiences at enterprise scale."
  About strip closing:
    "The rare hire who closes the gap between what
    technology can do and what a business needs to deliver."

  Contact strip headline:
    "The right problem. The right partnership."
    (animates as two separate elements)
  Contact strip body:
    "Open to the right full-time leadership roles
    and consulting partnerships. If the problem
    sits at the intersection of design, data,
    and technology — let's talk."
  Contact CTAs:     "Contact form →" + "LinkedIn →"
  Email:            NOT displayed publicly anywhere on site
