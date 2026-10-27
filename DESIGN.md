---
name: Axel Nava — Developer Workspace
description: A console-focused personal workspace with Catppuccin colors and direct controls.
colors:
  canvas-dark: "rgb(15, 15, 15)"
  canvas-light: "#7c7f93"
  mocha-base: "#1e1e2e"
  mocha-crust: "#11111b"
  mocha-surface0: "#313244"
  mocha-overlay1: "#7f849c"
  mocha-text: "#cdd6f4"
  mocha-subtext0: "#a6adc8"
  mocha-blue: "#89b4fa"
  mocha-green: "#a6e3a1"
  mocha-maroon: "#eba0ac"
  mocha-red: "#f38ba8"
  mocha-peach: "#fab387"
  latte-base: "#eff1f5"
  latte-surface0: "#ccd0da"
  latte-overlay1: "#8c8fa1"
  latte-text: "#4c4f69"
  latte-green: "#40a02b"
typography:
  display:
    fontFamily: "Cascadia Code, system-ui"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "4rem"
  title:
    fontFamily: "FiraCode, system-ui"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "3.5rem"
  body:
    fontFamily: "FiraCode, system-ui"
    fontSize: "1.25rem"
    lineHeight: "2.5rem"
rounded:
  xs: "2px"
spacing:
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  8: "2rem"
components:
  command-action:
    rounded: "{rounded.xs}"
  project-action:
    rounded: "{rounded.xs}"
    padding: "{spacing.4}"
  info-panel-dark:
    backgroundColor: "{colors.mocha-base}"
    textColor: "{colors.mocha-subtext0}"
    padding: "0 0.75rem"
  knowledge-panel-dark:
    backgroundColor: "{colors.mocha-crust}"
    padding: "0 1rem"
  status-mode-dark:
    backgroundColor: "{colors.mocha-green}"
---

# Design System: Axel Nava

> Historical reference: this document describes the earlier extracted interface. The current workspace, navigation, and image viewer are documented in `README.md` and implemented in `src/pages/index.astro` and `src/styles/workspace.css`.

## Overview

**Creative North Star: "The Developer's Workspace — Console Focused"**

A technical, personal, and direct workspace built from terminal conventions: monospaced text, command prompts, bordered panels, and a segmented Vim-style status line. The owner has confirmed the console focus and the existing Catppuccin palette. This document records the restored implementation, not a selected replacement page concept.

The approved direction favors flat panels distinguished by borders and background tones. Controls should remain precise and console-inspired while understandable without command knowledge. The current implementation is evidence, not proof that every interaction already meets that goal. Understanding business requirements is part of the professional positioning in `PRODUCT.md`, not a decorative motif.

**Key Characteristics:**
- Console identity with visible actions alongside commands.
- Cascadia Code for the header; FiraCode for main content.
- Catppuccin Latte and Mocha, with restrained tonal depth.
- Rectangular panels and a distinctive segmented status line.

## Colors

Cool neutral surfaces support the existing Catppuccin accents; preserve their source values and established palette names.

### Primary

- **Mocha Blue:** technology headings and command-action hover borders.
- **Mocha Green:** normal-mode status and project-action hover borders.

### Secondary

- **Mocha Maroon:** section headings.
- **Mocha Red:** clock segment in the status line.
- **Mocha Peach:** command-state styling declared in the status-cell component; do not assume every declared state is wired up.

### Neutral

- **Dark / Light Canvas:** outer page backgrounds, distinct from panel surfaces. The current light canvas is an overlay-like gray, not Latte Base.
- **Mocha Base / Latte Base:** header surfaces; information panels explicitly assign Mocha Base only in dark mode.
- **Mocha Crust:** knowledge subpanels in dark mode.
- **Mocha Surface0 / Latte Surface0:** status-line tracks.
- **Mocha Overlay1:** dark panel borders and file-status segment.
- **Mocha Text / Subtext0:** command text and secondary panel content.
- **Latte Text / Overlay1 / Green:** light-theme text and status-cell accents where explicitly assigned.

**The Palette Fidelity Rule.** Preserve the existing Catppuccin values. Do not silently turn this documentation pass into a palette correction or normalize the incomplete light-theme assignments.

Source: `src/styles/global.css`; component assignments live in the Astro files. The frontmatter intentionally extracts reused roles rather than the entire declared palette.

## Typography

**Display Font:** Cascadia Code, with system-ui fallback.
**Body Font:** FiraCode, with system-ui fallback.

Monospaced typography carries the terminal identity. The header and body use distinct families rather than a new editorial font pairing.

### Hierarchy

- **Display:** the frontmatter describes the header title from the medium breakpoint upward; smaller screens inherit their base size. Its line height remains generous.
- **Title:** bold information-panel headings with room for branch and folder icons.
- **Body:** information-panel articles use the documented body role; this is not a global body assignment.
- **Supporting text:** header help uses 0.75rem on small screens and 1rem from the small breakpoint; its command list becomes 0.875rem there.
- **Status text:** viewport-relative 2.3cqi text below the small breakpoint, then 1.125rem.

No consistent maximum text measure is established in the current code. Do not invent one as an extracted token.

## Layout

The home page uses a responsive seven-column grid from the medium breakpoint, with section-specific spans. It is primarily a single-column flow below that breakpoint, though some children also declare small-breakpoint spans. Main gaps and vertical padding use spacing step 8; internal grids commonly use step 4. There is no shared max-width container.

The page wrapper applies 0.5rem horizontal padding to both html and body, reduced to 0.2rem below 35em. The header starts with a 2rem top margin. Its declared grid rows are `1fr 8rem auto`; the command line is an additional child.

Project dialogs occupy 90dvw by 80dvh with a 5% inset. Their content becomes a two-column layout (`1fr 50ch`) from the large breakpoint.

## Elevation & Depth

The examined components do not define a box-shadow vocabulary. Borders, contrasting background tones, and blur create separation. Information panels use a small backdrop blur; modal backdrops use an extra-small blur. The owner approved flat, border-and-tone-based depth without decorative shadows.

**The Flat Workspace Rule.** Use tone and borders for hierarchy, not decorative floating-card shadows.

## Shapes

Information panels are square-cornered with 2px borders. Command buttons and the CV link have minimally softened corners using the extra-small radius. Dialogs use 4px borders. Status cells have overlapping directional separators with rounded outer tips; they are a specific Vim-derived exception, not a general card shape.

## Components

### Command Actions

Text-first controls with transparent 2px borders and minimal corner softening. Hover reveals a blue border. Coarse or absent pointers receive a persistent visible border. Project actions use green instead, optional color transitions, and additional padding supplied by their call site. The source does not define custom focus-visible, disabled, or error styles; native focus behavior must not be described as a custom design treatment.

### Information Panels

Rectangular, bordered containers with branch icons, prominent headings, and generous article leading. Dark mode explicitly sets background, border, and secondary text colors. Main-content typography comes from `src/pages/index.astro`. Do not manufacture equivalent light-mode panel assignments where the source has none.

### Knowledge Panels

Inset dark surfaces with blue headings and a compact icon grid. Horizontal padding is spacing step 4; the grid moves from two to three columns at the small breakpoint.

### Status Line and Command Entry

A segmented Vim-inspired status strip carries mode, file, directory, position, and clock. Green identifies normal mode; muted segments carry context; red identifies the clock. Directional separators and icon glyphs belong to this signature component.

The command entry is a contenteditable span activated by keyboard interaction, not a conventional text input. The title types in at 100ms per character; cursor animation uses a one-second step-end blink. These are observed behaviors, not newly mandated animation requirements.

### Project Dialogs

Native modal dialogs expose project details with a visible close button and blurred backdrop. The current source uses a responsive content grid and strong border. No custom modal motion is established.

## Do's and Don'ts

### Do:
- **Do** preserve the console-focused workspace identity and Catppuccin palette.
- **Do** keep actions understandable without requiring command knowledge.
- **Do** use flat panels, borders, and tonal separation.
- **Do** distinguish observed implementation details from approved future guidance.

### Don't:
- **Don't** add decorative shadows to create floating panels.
- **Don't** replace confirmed palette values or invent a new font pairing during documentation.
- **Don't** present missing interaction states or light-theme assignments as already implemented.
- **Don't** treat this record as approval of a replacement page layout.
