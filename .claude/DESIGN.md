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
LinkedIn:   linkedin.com/in/stephenchiang
Social:     LinkedIn only — X/Twitter removed from all pages.

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
                On scroll: rgba(19,19,19,0.8) + backdrop-filter blur(20px)
  Logo:         "SC" — Space Grotesk 700, #FFB77D, 16px
  Links:        Manrope 500, 11px, uppercase, ls 0.15em, #E5E2E1
  Active:       #FFB77D underline, scaleX(0)→scaleX(1) from left
  Time display: Manrope 500, 11px, uppercase, #5a5a58
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
  Sub-headline: "Leading delivery." — Manrope 400, 20px, #5a5a58
  Bottom strip: "DESIGN TECHNOLOGIST · UX ENGINEER · PRODUCT LEAD"
                Manrope 500, 11px, #5a5a58, uppercase, ls 0.15em
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
            right edge, Manrope 500, 10px, #5a5a58, ls 0.2em

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
  Section bg: #c97a20 — matches portrait so image bleeds edge to edge
  Vertical text: hidden on mobile
  Caption:    hidden on mobile

ALL OTHER IMAGES
  Duotone: highlights → #E5E2E1, shadows → #0E0E0E
  Grain:   5% SVG feTurbulence overlay on all work images
  Caption: "REF_001 // SCALE 1:1" style — see Typography
  Container: 0px radius, no border box

WORK ROWS
  Ghost number: 160px Space Grotesk 700, #FFB77D, opacity 8%
  Project name: 36–40px Space Grotesk 700, #E5E2E1
  Category tag: 11px Manrope 500 caps, #5a5a58, right-aligned
                white-space: nowrap, text-overflow: ellipsis
  Outcome:      13px Manrope 400, #5a5a58, right-aligned
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

WRITING LIST
  Ghost number: 48px Space Grotesk 700, #FFB77D, opacity 20%
  Title:        28–32px Space Grotesk 700, #E5E2E1
  Meta:         11px Manrope 500 caps, #5a5a58
                Format: "CATEGORY · MON YYYY · X MIN"
  Hover:        title → #FFB77D
                4px left bar in #FFB77D slides in from left
                NO background lift (different from Work rows)
                data-cursor="read" — cursor shows "READ →"
  Mobile:       font-size: clamp(18px, 4.5vw, 24px) on title
                Meta stacks below title, left-aligned
                Ghost number: 72px
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
  Label:        Manrope 400, 13px, #5a5a58
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
                Manrope 400, 16px, #5a5a58, max-width 480px
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
  Labels:       10px Manrope 500, uppercase, #5a5a58
  Button:       full width, gradient #FFB77D→#D97707, #0c0c0c text,
                Space Grotesk 700, uppercase, 0px radius
  Hover:        bg inverts — #0c0c0c bg, #FFB77D text

FOOTER
  Content:      "STEPHEN CHIANG [year]" left
                Easter egg hint center
                "LINKEDIN" right (LinkedIn only — no X)
                (+ "Style Guide ↗" in #FFB77D after unlocked)
  Style:        Manrope 500, 11px, uppercase, ls 0.15em, #5a5a58
  Border:       1px solid #222220 top
  Easter hint:  "This site has secrets. Explore to find them."
                Manrope 400, 10px, #2a2a2a
                Reveals to #5a5a58 on hover — cursor: default
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
  Border:       1px solid #FFB77D left edge
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
    LIFE        Single father of three.
                Everything else fits around that.
    ON MY MIND  How AI changes the roles of both the designer
                and the developer — not whether it will,
                but how fast, and whether either discipline
                is ready for it.
                And the question nobody is answering well yet:
                how do you actually measure whether an AI
                implementation is working?
  Block style:  4px solid #FFB77D left border, 20px padding-left
  Label:        10px Manrope 500, uppercase, #5a5a58
  Body:         16px Manrope 400, #E5E2E1, lh 1.75
  Footer:       "Updated periodically. Last updated March 2026."
                Manrope 400, 11px, #5a5a58

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
                Manrope 400, 14px, #5a5a58
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
  data-cursor="read" → writing rows → "READ →"
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
