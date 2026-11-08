# Responsive images and viewer loading
Branch: refactor/neovim-experience. Preserve original image files and unrelated work.

## Specs
S1. «Al momento de cargar una imagen, esta esto
@C:/Users/napa2/AppData/Local/JetBrains/WebStorm2026.2/air/prompt-attachments/AIR_Screenshot_2026-10-27_10-09-45.png 

Primero está el loader y encima la imagen ya cargada, ¿porque esto es así?»
S2. «También otra cosa, para optimizar la carga de imagenes, realiza una tool que comprima las imágenes, y también para redimencionarlas y poder tener para varias pantallas, es decir, la máxima calidad será solo cuando se quiera ver a detalle, pero en forma de previsualización, en un mobil, etc, etc, que los tamaños cambien.»
S3. «Pero también manual, sería la 3»

## Tasks
T1 | S1 | inline | done | Fixed overlap with revision guard; browser RED/GREEN, existing scenarios, fast navigation, A→B→A and error/retry checks pass. Commit: 5bad11b.
T2 | S2-S3 | inline | done | Responsive WebP previews and manual full-build command implemented; original assets unchanged, manual command and browser checks pass. Commit: 5bad11b.
T3 | S1-S3 | parent + independent verifier | done | Independent static review found no blockers; parent ran browser and build checks. Verifier noted sizes can overfetch and did not independently confirm runtime. Commit: 5bad11b.

## Log
L1. «Al momento de cargar una imagen, esta esto
@C:/Users/napa2/AppData/Local/JetBrains/WebStorm2026.2/air/prompt-attachments/AIR_Screenshot_2026-10-27_10-09-45.png 

Primero está el loader y encima la imagen ya cargada, ¿porque esto es así?
También otra cosa, para optimizar la carga de imagenes, realiza una tool que comprima las imágenes, y también para redimencionarlas y poder tener para varias pantallas, es decir, la máxima calidad será solo cuando se quiera ver a detalle, pero en forma de previsualización, en un mobil, etc, etc, que los tamaños cambien.»
L2. Browser reproduced simultaneous loaded image and 1/1 loader: imageLoaded exposes image immediately, but hides loader after 500ms.
L3. «1» — automatic build-time generation selected after options automatic, manual, or both were presented.
L4. «Pero también manual, sería la 3» — user corrected the selection to both automatic and manual.
L5. Viewer overlap reproduced. Initial timing-based browser snippet timed out; replaced with DOM mutation observer. Regression RED then GREEN after holding image hidden until loader disappears with revision guard. Build passed; rapid navigation and prior viewer tests remain.
L6. ResponsivePreview.astro uses Astro Image/Sharp WebP quality 75 with width candidates and sizes for preview/evidence; original anchor remains viewer source. pnpm images:optimize runs the same full Astro build. Manual build exit 0; browser RED (missing srcset) then GREEN, all 17 project links have srcset/sizes and original hrefs. Comercializate preview sample: 390px viewport 480w 5,238 bytes; 1440px viewport 960w 16,458 bytes; original 80,200 bytes. Git diff/status show original asset directory unchanged. Node tests 8/8, git diff --check pass.
L7. Independent verifier found no blocking source defect; reported that sizes are estimates and may overfetch, and did not run functional checks. Parent verified 3 existing viewer scenarios, workspace tab/cache scenario, rapid navigation and cached A→B→A with clock, image failure/retry and close/reopen, no-JS at 390px, and browser candidate selection for preview/evidence at 390/768/1440px and DPR 1/2. Some high-DPR candidates are larger than rendered width; this is a sizing estimate, not proof of optimal byte use. Native ASSESS unassessable due unrelated untracked scope; no review authority.
L8. User authorized commit with «Si». Commit 5bad11b contains the eight scoped project files; unrelated concurrent text-motion, workspace, tool state and task files remained outside. Staged diff-check and Node 8/8 passed; Node tests ran against the working tree, which included unrelated concurrent changes. No push.
