---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/components/Projects.astro"]
---

# Landing — /
Mode: Experience. Approved composition: one Vim-style window with Experience / Projects / Contact tabs; Projects uses two stacked left panes and one spanning right pane. Owner supplied a topology sketch, not a raster visual comp.

## Direction contract
THESIS: A working developer's record, not an introductory splash screen; concrete experience comes before selected work.
OWN-WORLD: Catppuccin Mocha/Latte, locally hosted Cascadia Code and FiraCode, square tonal panels, fine rules, green status strip, blue links and maroon section headings. System theme follows the visitor's ambient workspace light.
STORY: Read Axel's current engineering responsibilities and reporting outcomes, inspect real project evidence, then reach verified social profiles. ES/EN controls are always visible.
FIRST VIEWPORT: A restrained file bar and compact identity sit above section tabs and a chronological ledger, with a shared status strip below. No portrait, CV, giant hero or mandatory command input. Projects has the active title/category/summary upper left, project selector lower left, and detailed contributions/screenshots on the right. Native evidence disclosures remain inline. Small or short viewports scroll naturally rather than clipping content.
FORM: Owner-selected chronological experience (option 2) plus left-hand project index and right-hand evidence. Seed reference: seed:98e48cd8b19b0701.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Constraints: no invented freelance dates, categories or public private-work evidence. Reporting figures only apply to reporting. Existing screenshots are owner-supplied project assets, never generated imagery.

## Observed implementation
- Sources: src/styles/workspace.css, src/pages/index.astro, src/components/Projects.astro. Existing palette/font definitions remain in src/styles/global.css.
- Workspace max-width 1440px, 1px rules, square corners, no decorative shadows. Enhanced frame uses height calc(100dvh - 3rem) above 900px wide and 600px high, fixed header/footer and internal content scrolling. Project columns use 1:2 proportions with a 15rem minimum sidebar; below 901px summary, selector and detail stack. Experience rows retain 1:3 columns and stack at 700px. Smaller/shorter viewports use natural page scrolling.
- Body: FiraCode/monospace, 0.9375rem, 1.75 line height. Display: Cascadia Code/monospace, clamp(1.75rem,3vw,2.5rem). Section headings: 1.4rem; titles: 1.15rem; support text: 0.75/0.8/0.875rem; project titles: 1rem. These intentionally differ from the earlier extracted DESIGN.md type ramp.
- Semantic theme aliases map existing Catppuccin colors: canvas Latte/Mocha crust; panel base; inset mantle; text foreground; secondary subtext1/subtext0; blue links; mauve/maroon headings; green status. Values were not redefined.
- Visible focus: 2px blue outline, 5px offset. Language buttons use aria-pressed. Native details supplies keyboard disclosure behavior. Screenshot links open image resources in the current tab.
- No entrance animations; smooth anchor scrolling respects reduced motion. Content is visible without JavaScript; Spanish is the server-rendered default, language changes are not persisted.

## Current layout verification
- User selected «Pestañas y distribución del dibujo»: title/summary upper left, selector lower left, detail spanning right. Existing copy and 17 owner-supplied screenshots preserved; numeric project prefixes removed from repeated labels.
- Node suite 5/5 passed; initial missing-tab-module RED and vertical-keyboard RED observed before fixes. Astro production build passed.
- Production browser: 48 states (320/390/700/768/900/901/1280/1440px × ES/EN × three sections), no horizontal overflow, exactly one visible section, project selection synchronizes summary/detail. All disclosures work, all 17 images decoded. At 1440×900 every section remains inside the viewport. A 1280×600 short viewport scrolls naturally. No-JS 390px exposes all three sections and four projects without overflow.
- Captures read back: vim-projects-desktop.png (1440 light ES), vim-projects-dark.png (1440 dark EN), vim-projects-mobile.png (390 dark EN). Summary and selector are grouped with tight spacing; 1px rules separate them from detailed contributions/evidence. Selected project uses border plus weight, not color alone.
- Independent verifier confirmed requested topology and selection; flagged vertical keyboard semantics and stale keyboard-selection URLs, subsequently corrected with RED/GREEN and targeted production checks. Its content-loss observation refers to the prior redesign baseline (Knowledge/About already absent before this request), not this layout change.
- Layout detector returned [] with exit 0. Native assessment remains unavailable due existing undeclared untracked scope; no authority or approval claimed. Risk: item 6 (no automated visual baseline). Formal finish review remains unavailable; not claimed.
- README and PRODUCT updated for actual tab/scroll controls. DESIGN.md remains the incumbent reference, not silently refreshed.

## Previous landing verification evidence and limits
- pnpm build: exit 0. Node suite: 2/2 passed; locale module RED missing import exit 1 preceded implementation.
- Production browser: order experience/projects/contact; both languages, document language, alt text and button state; native keyboard disclosures; all 17 images decoded; no overflow at 320,390,700,768,1280,1440px.
- Captures: .impeccable/review/desktop.png (1440 dark), desktop-light.png (1440 light), mobile.png (390 light), mobile-expanded.png (390 light, English, web evidence open). All four read back; production captures contain no developer toolbar or unloaded evidence.
- Independent gentle-ai-verify: no material scoped implementation defect, S1-S5 supported, with live-browser checks attributed to parent. This is not a formal impeccable finish-review verdict.
- Native assessment unavailable because existing untracked scope needs declaration. No native authority created, no approval claimed. Shipped impeccable finish-reviewer and documenter roles unavailable. DESIGN.md and its sidecar are preserved incumbent references, not silently overwritten.
- Risk: item 6 (no automated visual-regression baseline; human visual acceptance and formal review remain outstanding).

## Asset provenance
All shipping raster images are pre-existing owner-supplied project screenshots from src/assets/img/Projects/{comercializate,Compilador,Administrador_de_usuarios_creador_de_PDF's,unity}. Projects.astro contains exact source paths. Astro produces optimized webp variants; no new raster imagery was generated or sourced externally and no original raster was modified.
