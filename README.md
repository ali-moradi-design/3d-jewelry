# 3d-jewelry

A luxury jewelry and watch landing page for a **fictional** brand (Aurelune), built as a portfolio
demo. Scroll to move the camera in on a diamond ring, change its metal and stone, turn a watch and
look closer at its parts, then book a (fake) appointment. English only.

Live demo: `3d-jewelry.ali-moradi-develop.com` (deployed in roadmap phase 7).

## Stack

Next.js 16 (App Router, static export), React 19, TypeScript (strict), React Three Fiber + drei +
postprocessing, pnpm, ESLint + Prettier, Feature-Sliced Design checked with Steiger, Playwright
(E2E + axe), Lighthouse CI.

The ring, the watch and the studio lighting are generated in code, so there are no model files and
no model licenses to track. See `CREDITS.md`.

## Commands

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # static site in ./out
pnpm lint && pnpm typecheck && pnpm steiger && pnpm format:check
pnpm test:e2e       # builds nothing: run `pnpm build` first
pnpm lighthouse     # needs a Chrome binary (CHROME_PATH)
```

Scripts:

- `node scripts/generate-studio-hdr.mjs` rewrites `public/hdri/aurelune-studio.hdr`.
- `node scripts/generate-posters.mjs <url>` re-renders the poster images in `public/posters`
  (run after a visual change to a scene; serve `./out` first).

## Structure (Feature-Sliced Design)

```
app/            Next.js routes (re-export from src/pages)
src/app         global styles
src/pages       home page composition
src/widgets     hero, collection, watch-showcase, craftsmanship, appointment, header, footer
src/features    ring-customizer, appointment-form
src/entities    ring (geometry, options, selection store), watch (mesh, parts)
src/shared      config, hooks, scene slot / canvas, UI primitives
```

## Performance notes

- Each canvas is loaded with `dynamic(..., { ssr: false })` and only mounts when its slot is near
  the viewport (the hero mounts right after first paint). A poster image is shown until the first
  3D frames are drawn, and a scene stops rendering while it is off screen.
- Small or touch-first screens get a light scene: DPR capped at 1.5, no post-processing, no
  chromatic aberration, contact shadows instead of accumulated shadows.
- `prefers-reduced-motion` turns off the scroll-driven camera, the turntable and the watch hands.

## Deployment

See `docs/deploy.md`.
