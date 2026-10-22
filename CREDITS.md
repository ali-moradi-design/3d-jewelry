# Credits

Aurelune is a fictional brand. This page is a portfolio demo and nothing on it is for sale.

## 3D models and lighting

The ring, the watch and the studio HDRI are **original work**, generated in code:

- Ring: `src/entities/ring/lib/geometry.ts`
- Watch: `src/entities/watch/` (textures and strap are drawn in code too)
- Studio lighting: `scripts/generate-studio-hdr.mjs` writes `public/hdri/aurelune-studio.hdr`

No third-party 3D model, texture or HDRI image is shipped. (The first plan was to use CC0 / CC-BY
models; none of jewelry quality could be downloaded without a Sketchfab account, and a generated
ring and watch avoid any brand or license risk.) If a downloaded model is ever added, list its
author, link and license here and in `src/shared/config/credits.ts`.

## Libraries and fonts

| Name                                                                                   | Author                        | License     |
| -------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| [pmndrs/examples](https://github.com/pmndrs/examples) (`diamond-ring`, `bouncy-watch`) | Paul Henschel and Poimandres  | MIT         |
| [three.js](https://threejs.org)                                                        | three.js authors              | MIT         |
| React Three Fiber, drei, react-postprocessing                                          | Poimandres                    | MIT         |
| [postprocessing](https://github.com/pmndrs/postprocessing)                             | Raoul van Rüschen             | Zlib        |
| Next.js, React                                                                         | Vercel, Meta                  | MIT         |
| [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) (via Fontsource)     | The Cormorant Project Authors | SIL OFL 1.1 |
| [Inter](https://rsms.me/inter/) (via Fontsource)                                       | The Inter Project Authors     | SIL OFL 1.1 |

The full MIT notice for the pmndrs examples is in `LICENSE-THIRD-PARTY.md`. The same list is shown
on the page, in the footer, and kept in `src/shared/config/credits.ts`.
