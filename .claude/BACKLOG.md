# BACKLOG.md — Deferred ideas and future work
# Add new items as they come up during build sessions.
# Move items to DONE when completed.
# Reference this file at the start of any build session
# to pick up where you left off.

---

## PAGES — Not yet built

- [ ] Work project page template (`work/$slug.tsx`)
      Full project case study layout — hero, challenge,
      process, outcome, metrics strip, pull quotes,
      challenge callouts, related projects

- [ ] Article page template (`writing/$slug.tsx`)
      Long-form article layout — hero, table of contents,
      pull quotes, code blocks, related articles

- [ ] Contact page (`contact.tsx`)
      Contact form, availability note, LinkedIn link
      No email displayed publicly

---

## VISUALISATIONS — Deferred

- [ ] **Streamgraph — About page**
      Location: Experience or Industries section
      X axis: career years (2002–present)
      Streams: industry categories
      Story: shows how industry focus has evolved
      across 20+ years of career
      Data volume: rich — will look beautiful
      Library: @visx/shape area stack
      Revisit: when about page gets visual upgrade

- [x] **Streamgraph — Writing index** — DONE ✓
      Implemented with stackOffsetWiggle + stackOrderInsideOut,
      6-color palette (solid top 3 / patterned remainder),
      clip scan + stagger animation, tags as data metric

- [ ] **Hiker SVG animation**
      Simple stick figure hiking up a diagonal trail
      Mountain triangle background, one pine tree,
      figure with backpack, no walking stick
      Loop animation — figure walks in place,
      mountain + tree scroll behind
      Current state: partial prototype built in chat
      Potential locations: about page "Beyond the Brief"
      section, loading state, 404 page

---

## CONTENT — Draft articles

- [ ] **"How AI Has Accelerated My Work"**
      File: `content/writing/how-ai-has-accelerated-my-work.mdx`
      Status: draft (not published)
      Subtitle: "Not the hype. The actual delta."
      Category: Design Technology
      Angle: specific and honest — not evangelical.
      The meta angle: used AI to build this portfolio,
      which is itself a case study in AI-accelerated
      delivery. The gap between what this site would
      have taken 2 years ago vs now is the story.

- [ ] **"The Best AI UX I've Seen"**
      File: `content/writing/the-best-ai-ux-i-have-seen.mdx`
      Status: draft (not published)
      Subtitle: "What separates AI that earns trust
      from AI that erodes it"
      Category: Data & AI
      Angle: not a listicle of tools — a framework
      for what good AI UX looks like. Connects to
      HMI expertise and mechanical keyboards philosophy.
      Thesis already written in about page copy:
      "that obsession with how things feel to use
      shapes how I think about HMI design and how
      AI should show up in the hands of real people"

---

## DESIGN — Deferred decisions

- [ ] **Pattern header — fade transitions**
      The three-segment chaos→waves→order pattern
      on the work page header currently has hard cuts
      between segments. Fade transition version was
      designed but not implemented — hard cuts were
      tested first and kept.
      Revisit: if the hard cuts feel too abrupt after
      living with them for a while.
      Prompt is saved in chat history.

- [ ] **About page visual upgrade**
      Current about page is functional and complete.
      Future upgrade could include:
      - Streamgraph in Experience section
      - Additional images in "Beyond the Brief"
        (real photos needed: professional-01.jpg,
        personal-01.jpg, personal-02.jpg)
      - B&W → colour reveal on portrait
        (prompt written, not yet implemented)

---

## TECHNICAL — Deferred

- [ ] **PWA service worker**
      Offline support — not yet implemented
      manifest.json exists, icons needed
      Generate PNG icons from favicon.svg via
      realfavicongenerator.net
      Required sizes: 32px, 180px, 192px, 512px

- [ ] **Real images**
      Placeholder paths still in use:
      `/images/about/professional-01.jpg`
      `/images/about/personal-01.jpg`
      `/images/about/personal-02.jpg`
      `/images/work/maritime-intelligence.jpg`
      `/images/work/data-governance.jpg`
      `/images/work/maritime-dashboard.jpg`
      `/images/portrait/stephen-chiang.jpg` ✅ done

- [ ] **Work project hero images**
      Each project MDX references a heroImage path
      that doesn't exist yet. Add real screenshots
      or mockups before launching project pages.

- [ ] **Motion layer audit**
      GSAP scroll triggers exist on homepage and
      about page. Verify all pages have consistent
      scroll-triggered reveal animations before
      final launch.

- [ ] **DESIGN.md sync**
      Update DESIGN.md after every significant
      build session per CLAUDE.md instructions.
      Last updated: March 2026 (writing index page +
      streamgraph + shared components complete)

---

## IDEAS — Not yet decided

- [ ] **404 page**
      Could use the hiker SVG animation —
      hiker walking endlessly, "You've gone
      off trail" copy

- [ ] **Loading state**
      Simple copper spinner or the hiker
      animation for slow connections

- [ ] **CV / Resume download**
      A downloadable PDF version of the about
      page content. Could be a CTA on the
      about page or contact page.
      Would need a `data-cursor="download"`
      cursor treatment.

- [ ] **Case study password protection**
      For NDA projects — ability to password
      protect individual project pages
      rather than removing them entirely

---

## DONE

- [x] Homepage — desktop + mobile
- [x] About page — desktop + mobile
- [x] Work index page — with insights panel,
      search, filters, visualisations
- [x] Writing index page — with streamgraph insights panel,
      search, filters, 3-digit ghost numbers
- [x] Nav order: ABOUT · WORK · WRITING · CONTACT
- [x] Easter eggs — Currently drawer,
      Style Guide drawer
- [x] Design system — DESIGN.md locked
- [x] CLAUDE.md — conventions documented
- [x] MDX content — 3 projects, 2 articles
- [x] Draft status field on content types
- [x] Favicon SVG
- [x] Deployed to Vercel at www.chiang.ink
