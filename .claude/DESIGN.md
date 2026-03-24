# DESIGN.md — Stephen Chiang Personal Site
# Feed this file into every Claude build conversation.
# It is the single source of truth for all design decisions.

---

## Identity

Name:     Stephen Chiang
Title:    Design Technologist / Product & Technology Leader
Tagline:  Engineering the strategy behind how products get built
Email:    stephen@chiang.studio
Location: Stavanger, Norway
Timezone: CET

---

## Color Tokens

--color-bg:           #0c0c0c   /* Primary background */
--color-surface:      #141414   /* Section lift */
--color-card:         #1a1a1a   /* Cards, form areas */
--color-invert-bg:    #f5a020   /* Inverted section background */
--color-invert-text:  #0c0c0c   /* Text on inverted section */
--color-text-primary: #efefec   /* Primary text */
--color-text-muted:   #5a5a58   /* Muted / secondary text */
--color-accent:       #f5a020   /* Orange — ONLY accent color */
--color-border:       #222220   /* Default dividers */
--color-border-accent:#f5a020   /* Featured / active borders */

---

## Typography

Display font:   Clash Display (fontshare.com)
                Weights used: 100 (hairline) and 900 (black)
                Used for: hero headline, section titles,
                ghost numbers, pull quotes
Body font:      Inter (Google Fonts)
                Weights used: 400 (regular) and 500 (medium)
                Used for: body copy, UI labels, captions
Label style:    Inter 500, 10–11px, uppercase,
                letter-spacing: 0.15em

Type scale:
  --text-label:   11px  / Inter 500 / uppercase / ls 0.15em
  --text-caption: 12px  / Inter 400
  --text-body:    16px  / Inter 400 / lh 1.75
  --text-body-lg: 18px  / Inter 400 / lh 1.75
  --text-sub:     20px  / Inter 400
  --text-h3:      24px  / Inter 600
  --text-h2:      32px  / Clash Display 700
  --text-h1:      clamp(48px, 7vw, 80px) / Clash Display 900
  --text-display: clamp(72px, 11vw, 120px) / Clash Display 100+900
  --text-ghost:   160px / Clash Display 900 / opacity 8%

---

## Spacing

Base unit:          8px
Section padding:    120px vertical (desktop) / 72px (mobile)
Container max:      1280px
Side margins:       80px (desktop) / 24px (mobile)
Card padding:       40px (desktop) / 24px (mobile)
Row padding:        32px vertical per work row

---

## Borders & Radius

Border radius:      0px everywhere — cards, buttons,
                    inputs, images, all elements
Default border:     1px solid #222220
Accent border:      1px solid #f5a020
Featured left:      4px solid #f5a020 (challenge callouts,
                    pull quotes, active TOC items)

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
  Portrait:     full height bleed, duotone treatment
                filter: grayscale(100%) contrast(1.35) brightness(0.85)
                overlay: rgba(245,160,32,0.65) mix-blend-mode multiply
                grain: SVG feTurbulence 8% opacity
                fade: gradient to transparent at 60% height
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
                LINKEDIN · X right
  Style:        11px Inter 500 caps, #5a5a58
  Border:       1px solid #222220 top

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
2.  Shared components — Nav, Footer
3.  Homepage — Hero, Work rows, About strip,
    Writing list, Contact strip
4.  Work index page
5.  Project page template
6.  Writing index page
7.  Article page template
8.  Contact page
9.  MDX loader + /content directory wiring
10. Content — drop in MDX files
11. Motion layer — GSAP scroll triggers + cursor follower
12. Portrait duotone — CSS filter stack
13. Deploy to Vercel
