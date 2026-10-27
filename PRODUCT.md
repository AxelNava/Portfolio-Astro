# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Recruiters and technical teams evaluating Axel Nava for employment.
- Potential freelance clients evaluating Axel Nava for project work.
- Both audiences are confirmed; their relative priority is undecided.

## Product Purpose

Present Axel Nava's professional profile, experience, and projects so visitors can evaluate his work for employment or freelance opportunities.

## Positioning

A FullStack developer with a broader software development practice spanning web applications, desktop applications, and tools, with the ability to understand the business model and translate business needs into software requirements. This is owner-confirmed positioning, not evidence for invented commercial results. Do not frame the portfolio primarily around video game development.

## Capabilities and Constraints

- The existing portfolio content remains valid, as confirmed by the owner.
- The existing implementation uses Astro and Tailwind CSS.
- Current landing features include Spanish and English content, chronological professional experience, inline project details with screenshot disclosures, verified social profile links, and visible console-inspired navigation. The approved redesign excludes the portrait and CV download; old components remain on disk but are not imported.
- Functions and interactions may be reconsidered while retaining the terminal theme.
- The owner approved the experience-first composition and separately authorized implementation.
- Information hierarchy: compact identity and visible Experience / Projects / Contact tabs in one Vim-style window, with chronological experience and Unilink first by default. Projects use a selected title/summary above a selector on the left and detailed information on the right. Stack the same reading order on mobile; allow natural scrolling on small or short viewports.
- Use visible controls without requiring commands. Appearance follows the system's light/dark preference.
- Audience priority remains unspecified; do not invent it.

## Brand Commitments

- Professional identity: Axel Nava.
- Preserve the terminal theme, focused on a developer's console workspace. The owner confirmed a technical, personal, and direct character and the existing Catppuccin colors; see `DESIGN.md` for visual guidance. The selected landing uses a chronological experience ledger and project evidence index, with native navigation and disclosure controls.
- FullStack, web, desktop, and tools are the confirmed professional focus.

## Evidence on Hand

- Current profile and experience: `src/pages/index.astro` and `public/Languages/es.json`.
- Existing project content includes a compiler, a desktop application for water-service billing, web administration panels, and a piano game.
- Project presentation: `src/components/Projects.astro`.
- Existing terminal-inspired header: `src/components/VimHeader.astro`.
- Existing portrait: `src/assets/img/me.webp`.
- English translations: `public/Languages/en.json`.
- Content validity is confirmed; individual descriptions may be revised with the owner. Do not invent clients, achievements, metrics, or testimonials.

## Product Principles

1. Support both employment and freelance evaluation without assuming an audience priority.
2. Communicate FullStack expertise and the broader web, desktop, and tools practice.
3. Retain terminal identity while allowing the interaction model to evolve.
4. Ground professional claims in the owner's actual experience and project evidence.
5. Agree on concepts before changing the page.
