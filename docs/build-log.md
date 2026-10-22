# Build log

## 2026-10-22: session 1 (prerequisites and proposal)

- Checked prerequisites: git 2.43.0, node v22.22.0, pnpm 10.28.0, Playwright 1.56.1
  with the preinstalled Chromium (WebGL2 works via SwiftShader). The folder is a
  clone of `ali-moradi-design/3d-jewelry` with no commits yet.
- `gh auth status` FAILS: the `GH_TOKEN` in this environment is invalid. GitHub
  access works through the MCP tools and the git proxy instead. The private
  `roadmap-portfolio` repo is readable.
- Created `main` and pushed it; this work branch is `claude/vibrant-ride-4rthb5`.
- Copied the brief into `docs/brief.md`. Decision: English only.
- Ran `diamond-ring` and `bouncy-watch`, took screenshots, found CC-BY replacement
  models, drew the mockups. See `docs/proposal.md`. No app code yet.
- Next: wait for approval of the proposal, then scaffold Next.js in a small PR.

## 2026-10-22: session 1 (build, approved)

- Approved: brand Aurelune, the six page sections, ivory / ink / champagne-gold look.
- Decision: ring, watch and studio HDRI are generated in code (no downloads possible from
  Sketchfab without an account; no brand or license risk).
- Built in three PRs: (1) tooling, CI, shared layer, ring entity, hero and header;
  (2) collection (ring customizer) and watch showcase; (3) craftsmanship, appointment form,
  footer with credits, Playwright E2E + axe, Lighthouse CI.
- Checks run locally: `pnpm lint`, `pnpm typecheck`, `pnpm steiger`, `pnpm format:check`,
  `pnpm build`, `pnpm test:e2e` (14 tests, desktop and mobile), `pnpm lighthouse`
  (accessibility and best practices pass; performance about 0.6 on the software GL renderer).
- Known limits: AR is not part of this page; real-device GPU performance was not measured here
  (the sandbox only has a software renderer).
