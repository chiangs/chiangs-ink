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

- [x] Article page template (`writing/$slug.tsx`) — DONE
      Long-form article layout — hero, table of contents,
      pull quotes, code blocks, related articles,
      interactive MDX components, mobile image fallback

- [ ] Contact page (`contact.tsx`)
      Contact form, availability note, LinkedIn link
      No email displayed publicly

- [ ] **Contact page — drawing canvas**
      Component: `~/components/contact/DrawingCanvas.tsx`
      Library: `@visx/drag` (useDrag hook — add to ~/lib/visx.ts exports)
      Interaction: freehand drawing via useDrag onDragStart/onDragMove/onDragEnd
      Each gesture → new SVG <path> appended to strokes array
      Controls: "Clear" button + undo (pop last stroke)
      Export: SVG → canvas → canvas.toDataURL('image/png') → base64 PNG
      Submission: base64 string as hidden field or JSON alongside form data
      Note: SVG must use explicit hex #131313 background rect (not CSS var)
            — CSS variables do not resolve when SVG is serialised for canvas
      Touch: built into @visx/drag via pointer events — no extra handling needed
      Revisit: when contact page (contact.tsx) is being implemented

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
      section, loading state (NOT 404 — built as canvas variants)

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

- [ ] **"The Dashboard Nobody Uses"**
      File: `content/writing/the-dashboard-nobody-uses.mdx`
      Status: idea (not started)
      Subtitle: "Why expensive data products get built and ignored"
      Category: Data & AI
      Angle: the adoption failure mode — a follow-up to
      "Dashboards Are Not For Overview". Shifts from
      philosophy (what dashboards are for) to pathology
      (why they fail in practice). Org design, incentives,
      and the gap between the person who commissions a
      dashboard and the person who has to use it daily.
      Direct case study material from maritime + oil & gas work.

- [ ] **"What Good AI Handoff Looks Like"**
      File: `content/writing/what-good-ai-handoff-looks-like.mdx`
      Status: idea (not started)
      Subtitle: "The UX of giving a decision back to a human"
      Category: Data & AI
      Angle: not about models or prompting — about the
      threshold moment when AI hands control back to a person.
      How should that feel? What does the interface communicate?
      What does a bad handoff cost in high-stakes environments?
      Connects HMI expertise directly to AI product design.
      Natural companion piece to "The Best AI UX I've Seen".

- [ ] **"Data Governance Isn't an IT Problem"**
      File: `content/writing/data-governance-isnt-an-it-problem.mdx`
      Status: idea (not started)
      Subtitle: "The organisational design problem hiding inside your data strategy"
      Category: Data & AI
      Angle: most governance programmes fail because they're
      treated as taxonomy and tooling exercises. The real
      problem is ownership, incentives, and cross-functional
      accountability — which are design and leadership problems.
      Oil & gas engagement is a direct (anonymised) case study.

- [x] **"Why Prototypes Lie"** — PUBLISHED ✓
      File: `content/writing/why-prototypes-lie.mdx`
      Category: Design Technology · 8 min · order: 3

- [ ] **"The Figma File Isn't the Design"**
      File: `content/writing/the-figma-file-isnt-the-design.mdx`
      Status: idea (not started)
      Subtitle: "What the design actually consists of"
      Category: Design Technology
      Angle: the full article version of the about page thesis:
      "doesn't show up on a Figma file". Decision logic,
      edge cases, motion behaviour, content rules, error states,
      handoff conventions — none of it lives in the file.
      Strong hiring signal: this is what senior design
      leadership actually thinks about.

- [ ] **"The Interpreter Role Nobody Hires For"**
      File: `content/writing/the-interpreter-role-nobody-hires-for.mdx`
      Status: idea (not started)
      Subtitle: "What happens when nobody speaks all four languages"
      Category: Product & Leadership
      Angle: engineering, design, data, and business strategy
      are four languages most orgs keep in separate rooms.
      The cost isn't missed meetings — it's translation loss
      at every handoff. This is the Design Technologist
      positioning made into a direct argument.
      Strongest piece for attracting the right hiring audience.

- [ ] **"How to Run a Technical Discovery"**
      File: `content/writing/how-to-run-a-technical-discovery.mdx`
      Status: idea (not started)
      Subtitle: "What a good discovery actually produces — and what a bad one costs"
      Category: Product & Leadership
      Angle: practical and specific. Discovery is the most
      under-specified phase in most product programmes.
      What are the deliverables? What decisions does it
      unlock? What does skipping it actually cost downstream?
      Strong consulting credibility signal — shows methodology,
      not just outcomes.

- [ ] **"The Mobile Dashboard Is the Wrong Tool"**
      File: `content/writing/the-mobile-dashboard-is-the-wrong-tool.mdx`
      Status: idea (not started)
      Subtitle: "Why responsive charts don't shorten the distance
      to action — and what does"
      Category: Data & AI
      Angle: the dashboard-as-overview failure mode is worse on
      mobile because the format compounds the problem. Small screens,
      time-constrained contexts, and action-oriented users need a
      different interface entirely — not a smaller version of the
      desktop experience.
      Core argument: on mobile, an AI-powered briefing layer
      is a shorter path to decision than any chart. "MV Haldane
      Spirit needs to be fixed by Thursday" is more actionable
      than a red urgency score at 40px wide.
      Design position: the assistant is not a replacement for
      the dashboard — it is a context-appropriate entry point
      to the same data. The question the article must answer:
      does the mobile assistant replace the charts entirely,
      or does it sit above them as a briefing layer with the
      option to drill down?
      Connections: natural follow-up to "Dashboards Are Not
      For Overview". Overlaps with "What Good AI Handoff
      Looks Like" — the trust threshold for acting on an
      AI summary without seeing the underlying data is the
      same problem.
      Interactive component potential: a mock mobile AI
      assistant briefing screen — startup summary, ranked
      action list, drill-down toggle to reveal underlying data.
      Would be the article's equivalent of VesselPriorityDashboard.

- [ ] **"The Designer Who Can See Around Corners"**
      File: `content/writing/the-designer-who-can-see-around-corners.mdx`
      Status: idea (not started)
      Subtitle: "Why human judgment becomes more valuable
      as AI makes data interpretation a commodity"
      Category: Data & AI
      Primary audience: Senior executives, functional leaders
      Secondary audience: Designers, product practitioners
      Anchor: Jensen Huang, CEO of Nvidia — when asked who
      the smartest person he has ever met is, declined to
      name an individual and redefined intelligence for the
      AI era instead. Technical, coding-based intelligence
      is becoming a commodity. Future-proof intelligence is
      empathy, judgment, and the ability to see around corners.
      Source: https://www.youtube.com/watch?v=07v7o4hO-4k&t=2
      Core argument: AI commoditises the data interpretation
      layer the same way it commoditises coding. The designer
      who competes on the ability to read a heatmap, synthesise
      user research, or generate insights is competing with a
      tool that does it faster and cheaper. The designer whose
      value is judgment — knowing which insight to act on,
      which to question, which to ignore, and why — is not
      competing with AI at all. They are doing the thing
      AI structurally cannot do.
      The Huang reframe applied to design: empathy is the
      ability to understand what the data cannot capture —
      the anxiety a user feels at a particular moment, the
      political reason a stakeholder rejected a technically
      correct recommendation, the cultural context that makes
      a pattern in the data mean something different than it
      appears. Judgment is knowing what to do with that
      understanding. Seeing around corners is anticipating
      the consequences of a design decision before the data
      exists to confirm them.
      Structure: open with Huang's reframe → apply it to
      the designer's position in an AI-assisted workflow →
      define what judgment actually means in practice →
      argue that the organisations winning with AI-assisted
      design are the ones investing in human judgment, not
      replacing it → close with what this means for how
      senior leaders should be hiring and developing
      design talent
      Executive angle: this is not an article about design
      tools. It is an article about where irreplaceable
      human value lives in an AI-augmented organisation —
      and why the leaders who understand that distinction
      will outperform the ones who don't.
      Connections: companion piece to "Data Governance Isn't
      a Technology Problem". Natural follow-on from
      "Design Is Creation With Researched Intent" — judgment
      is the advanced form of researched intent.
      Notable: Huang quote as the opening anchor gives the
      article immediate credibility and shareability with
      a senior executive audience. Not a design trade press
      article — a leadership article that happens to be
      written by a designer.

- [ ] **"Data Governance Isn't a Technology Problem"**
      File: `content/writing/data-governance-isnt-a-technology-problem.mdx`
      Status: idea (not started)
      Subtitle: "Why the organisations that fail at data
      governance fail at it for human reasons"
      Category: Data & AI
      Primary audience: Senior executives, functional leaders
      Secondary audience: Designers, data practitioners
      Core argument: Most organisations treat data governance
      as a technology and taxonomy problem — buy the right
      platform, define the right terms, appoint a data steward,
      done. It fails because the hard problems are not technical.
      They are organisational: who owns a definition when two
      business units use the same term differently? Who has
      the authority to resolve a data conflict between a CFO
      and a COO? How do you design accountability structures
      that survive a reorg? These are design problems —
      problems of structure, incentive, and human behaviour
      — that no amount of tooling solves.
      Structure: general (what governance actually is) →
      theoretical (why the organisational and human dimensions
      are design problems) → practical (what this means for
      large complex organisations trying to get this right)
      Core argument: governance fails at the whiteboard, not
      the server room. The question is never "what tool should
      we buy" — it is "who is accountable, to whom, for what,
      and what happens when they disagree." That is an
      organisational design question. It requires design
      thinking, not data engineering.
      Secondary argument: ungoverned data makes design work
      impossible. AI-generated insights applied to a
      politically contested, inconsistently defined data
      layer produce confident answers to the wrong questions.
      The design work and the governance work are not
      sequential — they are the same conversation.
      Connections: companion piece to "The Designer Who Can
      See Around Corners". Direct relevance to enterprise
      data product design across maritime, oil & gas, and
      financial services contexts.
      Notable: no direct project references — argument is
      general, theoretical, and practical. Credibility
      comes from framework quality, not case study specifics.

- [ ] **"The PM as Proxy Manager"**
      File: `content/writing/the-pm-as-proxy-manager.mdx`
      Status: idea (not started)
      Subtitle: "How product management professionalised
      around distance instead of closing it"
      Category: Product & Leadership
      Primary audience: Senior executives, CPOs, founders
      Secondary audience: PMs, Design Technologists
      Core argument: Product management has drifted from
      a practitioner role into a coordination role. PMs
      manage the distance between users and engineers —
      translating research into requirements, requirements
      into tickets, tickets into releases — rather than
      closing it. The role has professionalised around
      the proxy chain rather than against it.
      The Design Technologist angle: a practitioner with
      design and technical fluency doesn't manage the
      proxy chain — they collapse it. Not by being a
      better PM but by eliminating the need for translation
      in the conversations where translation loss is most
      expensive.
      Executive angle: the proxy chain has a cost that
      doesn't appear on any budget. It appears in delivery
      timelines, in products that technically work but
      nobody uses, and in the gap between what was approved
      and what was built.
      Series position: Article 1 of 4 — establishes the
      structural problem the series diagnoses.
      Connections: leads into discovery debt and the
      technical credibility gap. Synthesis in
      "When the PM and the Designer Are the Same Person".

- [ ] **"Discovery Debt"**
      File: `content/writing/discovery-debt.mdx`
      Status: idea (not started)
      Subtitle: "What teams get wrong about the most
      consequential phase in product development"
      Category: Product & Leadership
      Primary audience: Senior executives, CPOs,
      programme sponsors
      Secondary audience: PMs, designers, delivery leads
      Core argument: Discovery is under-resourced because
      most teams don't know what it produces. It is treated
      as a research phase — a box to tick before development
      starts — rather than the phase that determines whether
      the team is solving the right problem before committing
      to solving it expensively.
      What discovery actually produces: not research
      artefacts. Not personas. Not journey maps. A confident
      answer to one question: are we solving the right
      problem, for the right person, in a way that is
      technically and organisationally achievable?
      The Design Technologist angle: a practitioner who
      holds design research methods and technical fluency
      simultaneously can run discovery that produces both
      user insight and architectural constraint in the
      same conversation.
      Executive angle: the most expensive product decisions
      are made in the discovery phase — or made by default
      when discovery doesn't happen. Resourcing discovery
      properly is the cheapest risk mitigation available
      to a product programme.
      Series position: Article 2 of 4.
      Connections: pairs with "Who Owns the Outcome" to
      complete the front-to-back product process diagnosis.

- [ ] **"Who Owns the Outcome?"**
      File: `content/writing/who-owns-the-outcome.mdx`
      Status: idea (not started)
      Subtitle: "Why product teams ship features and
      call it success"
      Category: Product & Leadership
      Primary audience: Senior executives, CPOs,
      board-level sponsors
      Secondary audience: PMs, delivery leads,
      engineering managers
      Core argument: Most product teams own outputs —
      features, releases, roadmap items. Very few own
      outcomes. The failure is three simultaneous problems:
      measurement (success was never defined in behavioural
      terms), political (nobody wants accountability for a
      metric they cannot fully control), and timing (the
      team has moved on before the outcome is measurable).
      All three reinforce each other.
      The fix must be established before the build starts —
      a clear definition of what behavioural change the
      product is designed to produce, who is accountable
      for measuring it, and what the team will do if the
      measure doesn't move.
      Executive angle: a board that accepts feature delivery
      as a success metric is not governing a product
      programme. It is governing a build programme.
      Series position: Article 3 of 4.
      Connections: pairs with "Discovery Debt".

- [ ] **"The Technical Credibility Gap"**
      File: `content/writing/the-technical-credibility-gap.mdx`
      Status: idea (not started)
      Subtitle: "Why the rarest PM is also the most
      valuable — and what to do if you can't find one"
      Category: Product & Leadership
      Primary audience: CPOs, CTOs, founders,
      senior hiring leaders
      Secondary audience: PMs, Design Technologists,
      engineering managers
      Core argument: A PM with genuine technical fluency
      is rare and disproportionately valuable. Not because
      they can replace an engineer's judgment but because
      they can engage with it directly without translation
      loss. Organisations spend years searching for this
      person. The search usually fails because the
      combination doesn't emerge from standard career
      paths in either discipline.
      The structural answer: the Design Technologist holds
      the technical and design dimensions natively. For
      organisations that cannot find the unicorn PM,
      understanding what the Design Technologist role
      delivers — and where it overlaps with product
      ownership — is the more productive question.
      Executive angle: stop searching for the unicorn.
      Start understanding what capability you actually
      need and what kind of practitioner delivers it.
      Series position: Article 4 of 4.
      Connections: resolves into the synthesis piece.

- [ ] **"When the PM and the Designer Are the Same Person"**
      File: `content/writing/when-the-pm-and-designer-are-the-same-person.mdx`
      Status: idea (not started)
      Subtitle: "What the Design Technologist role actually
      solves — and why most organisations haven't hired
      for it yet"
      Category: Product & Leadership
      Primary audience: CEOs, CPOs, CTOs, board-level
      sponsors, senior hiring leaders
      Secondary audience: Design Technologists, senior
      PMs, design and engineering leaders
      Core argument: The four problems diagnosed in the
      preceding articles are not individual failures.
      They are structural failures produced by an
      organisational model that separates design and
      product ownership into sequential roles. When the
      PM and the designer are the same person, the proxy
      chain collapses, discovery gets resourced, outcome
      ownership is natural, and technical credibility is
      built in.
      Why most organisations haven't hired for it yet:
      the role doesn't fit standard job architecture.
      It sits between disciplines in a way that confuses
      reporting lines, compensation bands, and career
      frameworks.
      Executive angle: the question is not "should we
      hire a Design Technologist." The question is "how
      much are the seams in our current product
      organisation costing us — and is that cost higher
      than the investment in closing them."
      Series position: Synthesis piece — references all
      four preceding articles. Strongest piece for direct
      promotion to senior executive audience. The piece
      a CPO forwards to their CEO.
      Connections: resolves the full Product & Leadership
      series. Natural endpoint for a reader who has
      followed the sequence.

- [ ] **[STUB] Humorous / personality piece**
      File: `content/writing/tbd.mdx`
      Status: stub (direction not yet decided)
      Subtitle: TBD
      Category: TBD
      Angle: A standalone article that shows personality
      and voice. Counterbalances the rigour of the
      rest of the writing section. Candidates under
      consideration — revisit when ready:
      "Things I've Heard In Stakeholder Meetings"
      "A Brief History of Dashboards Nobody Used"
      "What My Keyboard Says About Me"
      "The Standup That Could Have Been An Email"
      "Norwegian Winter and the 9am Meeting"
      Tone: dry, specific, affectionate rather than
      cynical. Humour comes from precision of
      observation, not mockery.
      Revisit: when the serious writing pipeline
      has more volume and the moment feels right.

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

- [ ] **Favicon update**
      Current favicon uses "SC" in Inter 900 on #131313 background
      with a 4px #FFB77D underline bar. Needs to be updated to match
      the live site font (Space Grotesk) and current brand refinement.
      Regenerate PNG icons after SVG update via realfavicongenerator.net.
      Sizes required: 32px, 180px, 192px, 512px.

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
      `/images/content/vessel-priority-dashboard.png` — mobile fallback
        for VesselPriorityDashboard in dashboards-are-not-for-overview.mdx

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
      Last updated: March 2026 (article page template +
      VesselPriorityDashboard interactive MDX component)

---

## IDEAS — Not yet decided

- [ ] **Loading state**
      Simple copper spinner or the hiker
      animation for slow connections

- [ ] **Case study password protection**
      For NDA projects — ability to password
      protect individual project pages
      rather than removing them entirely

- [ ] **Console easter egg**
      Trigger:    Opening browser DevTools on any page
      Method:     console.log() call in root.tsx useEffect,
                  client-side only (typeof window guard)
      Content:    Styled ASCII-style header — "SC" monogram
                  rendered in copper (#FFB77D) using console
                  %c styling, followed by plain text:
                  "You opened the console. We should talk."
                  LinkedIn URL on the line below —
                  linkedin.com/in/chiangs
                  Final line: "Built with React Router v7,
                  GSAP, and an unreasonable attention to detail."
      Tone:       Dry, confident — not cute. Speaks directly
                  to the technical hiring manager who opened
                  DevTools to inspect the build.
      Fires:      Once per session — sessionStorage flag
                  "sc-console-shown" prevents repeat on
                  every navigation.
      Location:   root.tsx — fires globally, not per-route

- [ ] **Project depth unlock — Work rows**
      Trigger:    Hovering a work row for 3+ seconds
                  (deliberate attention, not a drive-by scroll)
      Method:     setTimeout on onMouseEnter, cleared on
                  onMouseLeave — no libraries needed
      Reveal:     A single line fades in below the project
                  title, in #737371 Manrope 400 italic 13px:
                  "What actually made this hard: [one line]"
                  Each project MDX adds a hiddenNote field
                  to frontmatter — the unlock surfaces it.
      Animation:  opacity 0 → 1, translateY 4px → 0,
                  0.3s ease — subtle, not dramatic
      Reset:      Fades out immediately on mouse leave
      Persistence: None — resets every hover. No storage.
      Tone:       Honest and specific. The note should read
                  like something you'd only say in a room
                  with the right people. Not a boast —
                  a signal that you understand where
                  complexity actually lives.
      MDX field:  hiddenNote: "Getting Snowflake and a
                  legacy .NET BFF to agree on who owned
                  the truth."  ← example
      Location:   WorkRow.tsx + project MDX frontmatter

---

## DONE

- [x] Homepage — desktop + mobile
- [x] About page — desktop + mobile
- [x] Work index page — with insights panel,
      search, filters, visualisations
- [x] Work insights animations — treemap left-to-right stagger,
      waffle diagonal wave, network graph nodes/links,
      avg MVP countdown, animationKey restart pattern,
      accent glow pulse on toggle
- [x] Writing index page — with streamgraph insights panel,
      search, filters, 3-digit ghost numbers
- [x] Writing insights animations — streamgraph re-animates
      on expand, collapse bug fixed, accent glow pulse on toggle
- [x] InsightsPanel refactor — common shell extracted to
      common/InsightsPanel.tsx (toggle, GSAP height tween,
      onMount/onExpand callbacks); WorkInsightsPanel and
      WritingInsightsPanel use render-prop pattern
- [x] WorkInsightsPanel renamed (file + component + barrel)
- [x] useCountDown hook — ~/lib/hooks.ts; replaces inline
      countdown logic in AvgMVPStat and WritingInsightsPanel
- [x] Avg read time animation — countdown on mount + re-expand
- [x] Nav order: ABOUT · WORK · WRITING · CONTACT
- [x] Easter eggs — Currently drawer,
      Style Guide drawer
- [x] Design system — DESIGN.md locked
- [x] CLAUDE.md — conventions documented
- [x] MDX content — 3 projects (initial)
- [x] Draft status field on content types
- [x] Favicon SVG
- [x] Deployed to Vercel at www.chiang.ink
- [x] 404 page — three rotating canvas visualisation variants:
      NetworkGraph404 (force-directed graph, RAF physics),
      Heatmap404 (48×24 grid, 4 cell states, ghost "404"),
      Treemap404 (squarified, 7 items, scaleY stagger).
      Random on load; inline "click here" cycles to a different one.
      Desktop: 12-col grid, text cols 1–7, graph cols 5–12,
      heatmap/treemap cols 7–12, no gap, 2:1 aspect ratio panel.
      Mobile: compact 200px panel between body text and CTA.
- [x] Toast system — ToastContext + ToastProvider in lib/toast.tsx,
      useToast hook, Toast component in common/Toast.tsx.
      Used for navigation hint nudges (nav count thresholds 3 and 5).
- [x] ButtonCta component — copper gradient primary CTA button,
      0px radius, used on 404 page
- [x] Article page template — writing/$slug.tsx, full MDX pipeline,
      hero, sticky TOC, GSAP entrance, related articles strip
- [x] MDX component system — ArticleImage, FloatImage (raw prop on both),
      Highlight, PullQuote, DefinitionBlock; createMdxComponents factory
- [x] VesselPriorityDashboard — interactive MDX embed, desktop only;
      mobile PNG fallback; expandable urgency breakdown per vessel
- [x] Article mobile UX — reading progress bar (fixed top-16, h-0.5,
      accent fill, no transition) + floating scroll-to-top / back-to-writing
      buttons (fixed bottom-right, visible after 400px, opacity transition)
- [x] MDX content — 3 projects, 3 articles published:
      dashboards-are-not-for-overview, design-is-creation-with-researched-intent,
      why-prototypes-lie
