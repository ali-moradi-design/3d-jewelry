# Proposal (approved 2026-10-22)

> Outcome: the proposal was approved. Because Sketchfab models cannot be downloaded without a
> login, the ring and the watch were built in code instead (no third-party models, no license or
> brand risk), and the studio HDRI is generated too. See `CREDITS.md`.

## Source examples (run on 2026-10-22, pmndrs/examples, MIT)

- `diamond-ring`: runs. Needs `postprocessing` and `three-stdlib` added as direct
  dependencies (the example relies on workspace hoisting). Screenshot:
  `proposal/source-diamond-ring.png`. Loads its HDRI from Poly Haven at runtime
  (`peppermint_powerplant_2_1k`, CC0); we will bundle our own copy instead.
- `bouncy-watch`: runs. The model is a TAG Heuer Monaco with Gulf and Heuer logos on
  the dial: trademarked, so it must not be used. Its price label is also a joke
  (emoji). Only the viewer pattern (presentation controls, contact shadows) is reused.
  No screenshot is stored in this repo for that reason.

## Brand (fictional)

Recommended: **Aurelune** (Aurel + lune). Alternatives: Selenne Atelier, Orvane.
A trademark search is needed before the name is final, even for a demo.

## Page sections (English only)

1. Hero: ring close-up, camera moves closer on scroll, drag to rotate.
2. Collection: metal swatches (yellow, white, rose gold, silver), stone options
   (diamond, sapphire, emerald, ruby), demo price, "Reserve this ring".
3. Watch: turnable watch viewer, part hotspots (crown, dial, strap), spec grid.
4. Craftsmanship: four steps (design, casting, setting, polish).
5. Appointment: demo form (nothing is sent) with a success state.
6. Footer: fictional-brand notice and a credits link (`CREDITS.md` + on-page list).

Mockups: `proposal/mockup-desktop-1.png`, `proposal/mockup-desktop-2.png`
(placeholder images, not final models). Look: ivory background, ink text,
champagne-gold accent, serif display type, uppercase tracked labels.

## Licensed replacement models

See `proposal/model-candidates.png`. All are Sketchfab CC-BY 4.0 (no CC0 ring or
watch of jewelry quality exists on Sketchfab or Poly Haven).

Rings (recommended first):

- Trilogy Custom Engagement Ring, Aaron Clark, 25k faces (`6e9d6f66`): closest to
  the example look.
- Doji Diamond Ring, M. Visual, 76k faces (`297133c2`): needs heavy decimation.
- The Ring: 1 carat, Evan, 1.8k faces (`378f6df2`): lightest.

Watches (recommended first):

- Luxury Watch, Pieter Ferreira, 8k faces (`98acd80e`): generic dial.
- AMBASSADOR Heritage 1863, Mark Peters, 61k faces (`cd9d71cd`): elegant, check
  the dial for a real brand mark first.
- Khronos `ChronographWatch` (CC-BY 4.0, Eric Chadwick): downloadable from GitHub,
  but it carries Khronos and DGG logos in its variants; usable only if a logo-free
  variant is confirmed.

Every chosen model must be inspected for brand marks and then credited in
`CREDITS.md`.

HDRI: Poly Haven CC0 studio HDRI (for example `blocky_photo_studio`).

## Open items for the owner

- Sketchfab downloads need a logged-in account: download the glTF of the chosen
  ring and watch and place them in `assets/source/` (not committed).
- Approve brand, sections, look and the model picks.
