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
Location:   Stavanger, Norway
Timezone:   CET (Europe/Oslo)
LinkedIn:   linkedin.com/in/stephenchiang
X:          x.com/stephenchiang

Positioning:
  Primary audience:   Hiring managers for CTO, Head of Product,
                      Tech Lead, Principal Engineer roles
  Secondary audience: Consulting clients at enterprise/agency level
  Key differentiator: Senior technology leader who speaks design,
                      engineering, data, and business strategy —
                      without switching modes
  Military note:      14 years US Army Special Operations —
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
--color-text-muted:       #5a5a58   /* Muted / secondary text */
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

Label style:    Manrope 500, 10–11px, uppercase,
                letter-spacing: 0.15em

Type scale:
  --text-label:   11px  / Manrope 500 / uppercase / ls 0.15em
  --text-caption: 12px  / Manrope 400
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
  Manrope 500, 10px, uppercase, #FFB77D
  Positioned bottom-right, overlapping image edge slightly.

---

## Spacing

Base unit:          8px
Section padding:    120px vertical (desktop) / 72px (mobile)
Container max:      1280px
Side margins:       80px (desktop) / 24px (mobile)
Card padding:       40px (desktop) / 24px (mobile)
Row padding:        32px vertical per work row

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
  Logo:         "SC" — Clash Display 700, #f5a020, 16px
  Links:        Inter 500, 11px, uppercase, ls 0.15em, #efefec
  Active:       #f5a020 underline slides in from left on hover
  Mobile:       hamburger menu

HERO (homepage)
  Layout:       split — text left 55%, portrait right 45%
PORTRAIT (homepage hero)
  filter: grayscale(100%) contrast(1.35) brightness(0.85)
  overlay: rgba(245,160,32,0.65) mix-blend-mode multiply
  grain: SVG feTurbulence at 5% opacity (Stitch spec —
         "gritty screenprint" feel, not heavy noise)
  fade: gradient to transparent at 60% height
  caption: none (portrait is a design element, not content)

ALL OTHER IMAGES
  Duotone: highlights → #E5E2E1, shadows → #0E0E0E
  Grain: 5% SVG feTurbulence overlay on all work images
  Caption: "REF_001 // SCALE 1:1" style — see Typography
  Container: 0px radius, no border box
  Vertical text: "STEPHEN CHIANG © 2026" rotated 90deg,
                 right edge, 10px Inter, #5a5a58, ls 0.2em
  Live time:    top right of portrait, 11px, #efefec 60% opacity

WORK ROWS
  Ghost number: 160px Clash Display 900, #f5a020, opacity 8%
  Project name: 36–40px Clash Display 700, #efefec
  Category tag: 11px Inter 500 caps, #5a5a58, right-aligned
  Outcome:      14px Inter 400, #5a5a58
  Divider:      1px solid #222220 bottom
  Hover:        bg → #1e1e1e, name → #f5a020,
                ghost opacity → 18%
  Featured:     full width, #141414 bg,
                1px #f5a020 top + bottom border,
                left 60% name, right 40% outcome

ABOUT STRIP (inverted section)
  Background:   #f5a020
  All text:     #0c0c0c
  Ghost number: "001" — 120px Clash Display 900,
                clips left edge
  Body text:    28–32px Inter 500

WRITING LIST
  Ghost number: 48px Clash Display 900, #f5a020, opacity 20%
  Title:        28–32px Clash Display 700, #efefec
  Meta:         11px Inter 500 caps, #5a5a58
  Divider:      1px solid #222220
  Hover:        title → #f5a020, ghost opacity → 60%,
                #f5a020 bar slides in from left behind title

PULL QUOTE
  Font:         Clash Display 100, 36px, italic, #efefec
  Left border:  4px solid #f5a020
  Background:   #141414
  Padding:      32px

CODE BLOCK
  Background:   #141414
  Border:       1px solid #222220
  Padding:      24px
  Syntax:       #f5a020 for highlights
  Copy button:  10px Inter caps, #f5a020, top-right

CHALLENGE CALLOUT
  Background:   #141414
  Left border:  4px solid #f5a020
  Padding:      32px
  Text:         22px Inter 600, #efefec

METRICS STRIP
  Number:       Clash Display 900, 56px, #f5a020
  Label:        Inter 400, 13px, #5a5a58
  Dividers:     1px solid #222220 between items

CONTACT FORM
  Inputs:       underline only — 1px solid #f5a020 bottom,
                no background, no border box
  Labels:       10px Inter 500, uppercase, #5a5a58
  Button:       full width, #f5a020 bg, #0c0c0c text,
                Clash Display 700, uppercase, 0px radius
  Hover:        bg inverts — #0c0c0c bg, #f5a020 text

FOOTER
  Content:      "STEPHEN CHIANG 2026" left,
                easter egg hint center,
                LINKEDIN · X right
                (+ "Style Guide ↗" after style guide unlocked)
  Style:        11px Inter 500 caps, #5a5a58
  Border:       1px solid #222220 top
  Easter hint:  "This site has secrets. Explore to find them."
                10px Inter, #333330, reveals to #5a5a58 on hover

NAV — EASTER EGG INTERACTIONS
  SC monogram:  On homepage — clicking triggers style guide drawer
                On other pages — navigates to homepage
  Live time:    Clicking triggers "Currently" drawer
                Shows Stavanger time (Europe/Oslo timezone)
                Format: HH:MM

CURRENTLY DRAWER (easter egg — time display click)
  Trigger:      Click live time display in nav
  Animation:    Slides in from right, 0.45s cubic-bezier(0.16,1,0.3,1)
  Width:        min(420px, 90vw)
  Background:   #141414
  Border:       1px solid #f5a020 left edge
  Persistence:  No localStorage — resets each visit
  Sections:
    TRAINING    Strength, Muay Thai, and hiking.
                Currently trying to get lost in as many
                Norwegian fjords as possible.
    READING     The UX of AI — Greg Nudelman.
                Mid-way through the chapter on Digital Twins.
                The overlap with my current project work
                is uncomfortably well-timed.
    LIFE        Single father of three.
                Everything else fits around that.
    ON MY MIND  How AI changes the roles of both the designer
                and the developer — not whether it will,
                but how fast, and whether either discipline
                is ready for it.
                And the question nobody is answering well yet:
                how do you actually measure whether an AI
                implementation is working?
  Block style:  4px solid #f5a020 left border, 20px padding-left
  Label:        10px Inter 500, uppercase, #5a5a58
  Body:         16px Inter 400, #efefec, lh 1.75

STYLE GUIDE DRAWER (easter egg — SC monogram click on homepage)
  Trigger:      Click SC monogram when already on homepage
  Animation:    Same as Currently drawer
  Width:        min(600px, 92vw)
  Background:   #0f0f0f
  Border:       1px solid #f5a020 left edge
  Persistence:  localStorage key "sc-styleguide-unlocked"
                On first open: shows unlock message
                After unlock: "Style Guide ↗" appears in footer
  Unlock msg:   "You found it." — Clash Display 900, 24px, #f5a020
                "The design system behind this site.
                A link has been added to the footer
                so you can return whenever you like."
  Sections:     Color palette swatches
                Typography scale (live rendered)
                Spacing system (token table)
                Motion principles (listed)
                Build stack (tech credits)

---

## PWA & Favicon

Favicon:        /public/favicon.svg
                Inter 900, "SC" white on #0c0c0c,
                4px #f5a020 orange underline bar
                Pure SVG — no font dependency issues
                512×512 viewBox, scales to all sizes

PWA setup:      manifest.json — create in IDE
                Required icons: 192×192, 512×512 PNG
                (generate from favicon.svg via realfavicongenerator.net)
                apple-touch-icon: 180×180 PNG
                Theme color: #0c0c0c
                Background color: #0c0c0c
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
  6. 0.9s — portrait fades in with duotone wash transition
  7. 1.1s — nav links fade in left to right, 40ms stagger

Scroll reveals:
  Trigger:      when element enters viewport (IntersectionObserver
                or GSAP ScrollTrigger)
  Animation:    translateY(30px) → translateY(0) + opacity 0 → 1
  Duration:     0.6s ease-out
  Stagger:      200ms between sibling elements

Hover — work rows:
  Background:   transition 0.2s ease
  Text color:   transition 0.2s ease
  Ghost number: opacity transition 0.2s ease

Hover — nav links:
  Underline:    scaleX(0) → scaleX(1), transform-origin left,
                0.25s ease-out

Hover — buttons:
  Background/color invert: transition 0.2s ease

Cursor follower:
  Default:      8px circle, #f5a020, 60ms lag
  On hover:     expands to 40px, "VIEW →" text inside,
                0.3s ease transition

Portrait parallax:
  Rate:         0.6x scroll rate
  Direction:    moves up as user scrolls down
  Library:      GSAP ScrollTrigger

About section reveal:
  Animation:    background color wipes in left to right
  Duration:     0.6s ease-out
  Trigger:      section enters viewport

Writing "&" rotation:
  Animation:    360deg rotation, 20s linear infinite loop
  Direction:    clockwise

---

## Tech Stack

Framework:    React Router v7 (framework mode)
Styling:      Tailwind CSS v4
Animation:    GSAP + ScrollTrigger
Fonts:        Clash Display via fontshare.com
              Inter via Google Fonts
CMS:          MDX files in /content directory
MDX:          @mdx-js/rollup + @mdx-js/react
Deploy:       Vercel (vercelPreset() in react-router.config.ts)

---

## Build Order

1.  Project setup + Tailwind + fonts
2.  Favicon + PWA manifest
3.  Shared components — Nav, Footer
4.  Easter egg components — CurrentlyDrawer, StyleGuideDrawer
5.  Root layout — _layout.tsx wiring all drawers
6.  Homepage — Hero, Work rows, About strip,
    Writing list, Contact strip
7.  Work index page
8.  Project page template
9.  Writing index page
10. Article page template
11. Contact page
12. MDX loader + /content directory wiring
13. Content — drop in MDX files
14. Motion layer — GSAP scroll triggers + cursor follower
15. Portrait duotone — CSS filter stack
16. PWA offline support — service worker
17. Deploy to Vercel

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

  enterprise-data-governance-ai-readiness.mdx
    — Anonymous global oil & gas major
    — Data landscape mapping + governance strategy + tooling assessment
    — Role: Design Technologist (service design team)
    — Focus: federated governance model, AI-ready master data management
    — No hard metrics — scope and client scale carry the proof

  maritime-operations-financial-intelligence.mdx
    — Anonymous maritime operator
    — Internal B2B dashboard — operational + financial analysis
    — Roles: Tech Lead, Frontend Lead, Design Lead
    — Stack: Remix v2 / React
    — Metrics: 4 months to MVP
    — Notable: waffle charts, maps with near-real time updates,
               bar charts, typographic hierarchy as visualisation tool

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

COPY
  Hero tagline:     "Engineering the strategy behind how products get built."
  Hero descriptor:  "Design Technology · Product Strategy ·
                     Human-Machine Interfaces · AI Design & Integration"
  About strip:      See /content/copy/about-strip.md
  Contact note:     "Currently leading a national design, data, and
                     technology practice. Open to senior technology
                     leadership, head of product, and strategic consulting
                     engagements where the gap between design, engineering,
                     and business strategy needs closing."
