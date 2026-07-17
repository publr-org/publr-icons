# Publr Icons

Shared UI icons for Publr products. This repository is deliberately
framework- and package-manager-neutral: SVG files are the source of truth and
the TypeScript and Zig adapters are committed generated artifacts.

Social and brand icons do not belong here. They will have their own package.

## Layout

- `icons/*.svg` — canonical 24×24 UI artwork.
- `src/index.ts` — browser/TypeScript adapter.
- `publr_icons.zig` — Zig adapter for the design-system and CMS.
- `manifest.json` — stable machine-readable icon inventory.
- `index.html` — generated, self-contained all-icons gallery.
- `figma-plugin/` — local Figma plugin that creates editable components.
- `scripts/build.mjs` — validates SVGs and regenerates every adapter.

## Browser and editor

```ts
import { iconSvg, iconRef, mountIconSprite } from "@publr/icons";

button.innerHTML = iconSvg("plus", "size-5");
mountIconSprite();
```

The package has no runtime dependencies. Consumers may install it from the
Git repository or vendor it directly.

## Zig and CMS (no npm)

Vendor or pin this repository in the source tree and register the committed
Zig adapter as a build module:

```zig
const publr_icons = b.createModule(.{
    .root_source_file = b.path("vendor/publr-icons/publr_icons.zig"),
});
```

The CMS receives the same adapter through its vendored `publr_ui.zig` build
artifact, so CMS builds never run npm and never fetch icons at runtime.

## Development

```sh
npm run build
npm test
```

Both commands use Node's standard library only. Generated files must be
committed with SVG changes.

Open `index.html` directly to browse every icon, search by name, switch theme,
and click an icon to copy its canonical name.

## Create a native Figma file

1. Create or open an empty Figma Design file.
2. Open **Plugins → Development → Import plugin from manifest…**.
3. Select `figma-plugin/manifest.json` from this repository.
4. Run **Plugins → Development → Generate Publr Icons**.
5. Verify the generated `Publr Icons` page, then choose
   **File → Save local copy** to produce a genuine `.fig` file.

The plugin creates one editable 24×24 component per manifest icon, names them
as `Icon/<name>`, arranges them in a preview grid, and adds SVG export settings.
It performs no network requests. Running it in a non-empty file creates a new
page instead of deleting or replacing existing work.
