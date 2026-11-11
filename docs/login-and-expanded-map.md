# Login and expanded dashboard map

## Scope

Frontend-only corrections. No database operations, migrations, backend changes,
permissions changes or production operations.

## Expanded map

DialogPanel stops click propagation. SDK-level delegated marker clicks can therefore
be lost in expanded mode, even though previously selected content remains visible.
MapCanvas now handles the marker content click in React's capture phase and retains
the SDK onClick handler. Both paths use the same selection function and explicitly
reopen the panel. Existing map layer isolation is retained.

The regression uses the real modal and panel with a Google SDK double delegating
clicks to document. Removing the capture handler in the test bundle reproduces the
failure when selecting a new point after closing the expanded panel. The corrected
test passes selection, closing, reopening, expansion without a selection, collapse,
details, hit-testing and Escape. Live Google behavior still needs an authenticated
manual check; the test makes no Google requests.

## Login

- `src/App.tsx`: applies the new layout only to Login, not forgot/reset password.
- `src/pages/Auth/LoginLayout.tsx`: existing logo and corporate marker, map banner,
  original benefit copy, copyright and existing login form.
- `src/pages/Auth/login.css`: scoped approved palette, two-column desktop layout,
  mobile form layout, control styles and decorative corner.
- `src/assets/login-map.png`: generated decorative bitmap background; the thin,
  unfilled radius, marker and location caption are separate elements.
- `MapCanvas.tsx`: capture-phase marker selection and explicit panel opening.
- Browser harnesses and README: native-event regression and login visual coverage.

Login.tsx and useLogin.tsx were not changed. Session handling, validation, submission,
remembered email and password visibility retain their existing implementation.

## Verification

Executed successfully:

```sh
npm run build
npx eslint src/App.tsx src/pages/Auth/LoginLayout.tsx src/pages/Dashboard/components/DashboardMapView/MapCanvas.tsx tests/browser/dashboard-expanded-harness.tsx tests/browser/login-visual-harness.tsx
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/dashboard-expanded.cjs
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/login.cjs
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/login-visual.cjs
```

Build includes TypeScript validation. Existing large-chunk warning remains.
The intentional `MARKER_EVENT_BASELINE=1` run fails at expanded selection of the
second property, confirming the regression fixture detects the missing handler.
Login screenshots were checked at desktop and mobile sizes; automated layout checks
cover widths 320, 390, 768, 1024 and 1440px. No real backend authentication is tested.

## Image provenance

Tool: built-in image generation/editing tool. Saved asset: `src/assets/login-map.png`.
References: supplied original map and light banner reference. This is a decorative
illustration, not verified geographic data. Existing logo/pin assets were reused.

Final image prompt:

> Use case: style-transfer. Create a clean high-resolution decorative map BACKGROUND asset for the INMODATA login. Image 1 is the edit target: preserve its road network and river arrangement as closely as possible. Image 2 is ONLY the light palette/style reference. Convert the dark map into a crisp luminous flat map: warm ivory land, warm white/gray minor streets, restrained ochre/gold arterial roads, pale blue rivers, subtle sage parks. Output landscape 16:9. REMOVE all existing pin, circle, text, label, logo, watermark, glow and haze. The entire map must have uniform clarity, especially the central area: no radial tint, halo, blur, watermark effect, vignette or circular mark whatsoever. No text and no markers anywhere. We will overlay the corporate marker and thin circle as HTML separately. This is a decorative illustration, not a navigation map.
