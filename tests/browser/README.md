# Institutional access browser checks

Run `npm run build` first. The harness uses the built stylesheet, real application
components, and an isolated Apollo mock. It never connects to production.

Requires Node, Google Chrome, and Playwright available on `NODE_PATH`. No production
dependency was added. For an isolated tooling install:

```sh
npm install --prefix /tmp/inmodata-browser-tools --no-save playwright
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/institutions.cjs
```

The script starts a temporary localhost server and closes it and Chrome on completion.
Screenshots and the harness bundle remain in the printed OS temporary directory.

Coverage:
- External valuations start collapsed and load only after expansion.
- Readonly actions, newer-valuation indication, pagination, and mobile overflow.
- User creation with zero or multiple institutions.
- Existing assignments preload and can be changed.
- Removing the last institution requires confirmation before sending an empty list.
- Valuation edit controls follow backend authorization flags.
- Pre-appraisal samples show four columns for non-administrators and the full table for administrators.
- Sample references link only to authorized valuations, including global access.
- Deep links open a readonly valuation modal; unavailable IDs show no valuation data.
- Historical cards, exclusive chart expansion, date/value/sector tooltips and mobile width.
- RightPanel history link and tooltip require backend authorization; latest date replaces redundant risk metric.
- Year filter cancel/apply/clear, selection persistence, search preservation and page reset.
- Property code stays readonly and is excluded from the update mutation.

This is component integration coverage, not a real-account end-to-end test of Google
Maps. The property form map is stubbed to avoid network calls. Backend GraphQL and database authorization are tested separately in Sail.

## Session Security Regression

`NODE_PATH=/path/to/playwright/node_modules node tests/browser/session.cjs`

Uses the real session providers/interceptors with synthetic data and intercepted HTTP.
Checks isolated Apollo caches across logout/account changes, 401/419 expiration,
403 preservation, Lighthouse authentication errors, stale HTTP/GraphQL responses,
malformed stored profiles, retained preferences, and React StrictMode.
Requires local Chrome and the existing esbuild development dependency; no production credentials.

## Login Regression

`NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/login.cjs`

Uses the actual login form with intercepted HTTP only. Covers CSRF failures,
419/422/429 responses, profile 401/500 responses, invalid profile responses,
successful login, single submission with Enter, and loading-state recovery.
It does not access a database or authenticate against a real backend.

`node tests/browser/login-transport.cjs` verifies HTTPS normalization of Axios
URLs on HTTPS pages and preservation of local HTTP, using a fake adapter with no
network access. This does not test server-generated redirects.

## Reserved Administrator UI

After `npm run build`, run:
`NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/roles.cjs`

Uses the actual role forms and extra-permissions form with isolated Apollo responses.
Covers all 36 catalog entries, additional/custom entries, Roles > Editar mapping,
creation/editing, permission preservation, self-revocation refresh, denied mutations,
catalog failures, and mobile overflow. Prints desktop/mobile screenshot paths.

## Bank Analyst Workflow

After `npm run build`, run:
`NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/bank-workflow.cjs`

Uses real View, charts, create flow and preview hook with synthetic Apollo responses.
Checks readonly valuation modal/deep links, missing IDs, property-only permissions,
L/v2 point labels, financial/control tooltips, R1-at-top risk transitions, horizontal
chart scrolling without page overflow at 390/768px, and rejection of stale previews.
Also checks that a creator without edit permissions can start the first valuation
inside the creation workflow without entering Edit. The map is stubbed; no real
Google requests, business records or production credentials are used.

## Property View and Price Cache Regression

```sh
node tests/browser/valuation-cache.cjs
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/property-view.cjs
NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/bank-workflow.cjs
```

The cache regression reproduces the price/risk collision using identical GraphQL
`__typename`/IDs, then verifies the production cache policy keeps both measurements
separate. Bank workflow fixtures now include those typenames and exercise small,
thousand, ten-thousand, decimal, negative/zero-change, repeated-date and single-point
cases with full monetary labels and consistent absolute variation.

Property View checks field order and responsive layout, one reference, private and
missing-coordinate states, the shared Edit/View map button and readonly map events.
It runs the actual InmuebleMapPreview; only the Google SDK and Circle rendering are
mocked. It checks marker image loading, initial coordinates/zoom and that neither
map clicks nor marker drags can change View coordinates or dispatch mutations.
The editable variant is tested separately to preserve click/drag behavior.
Google tiles and real API authorization are not tested by these offline fixtures.

## Expanded Dashboard Map

`NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/dashboard-expanded.cjs`

Runs the real DashboardMapView, Headless UI dialog, MapCanvas and RightPanel with
synthetic GraphQL data and a Google SDK boundary double. The double includes a
high-z-index map pane to verify that internal map layers cannot cover the panel.
Checks hit-testing (not just DOM presence), point selection in both modes, retained
selection when expanding/collapsing, details, close and Escape. Google tiles are not
requested. `MAP_LAYER_BASELINE=1` removes only the new stacking style in the test
bundle and reproduces the failed panel hit-test without editing application files.

The marker double delegates native clicks to document, so the real DialogPanel's
stopPropagation behavior is exercised. `MARKER_EVENT_BASELINE=1` removes the React
capture handler only in the test bundle: selecting a different marker after closing
the expanded panel then fails. The fixed version also tests expanding with no
selection and reopening a closed panel.

## Login Visual Layout

After `npm run build`:
`NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/login-visual.cjs`

Uses the real login layout and form with intercepted HTTP. Checks loaded assets,
320/390/768/1024/1440px layouts, no horizontal overflow, brand colors, transparent
map radius, marker size, remembered email, password visibility and keyboard checkbox
operation. Screenshots are written to an isolated temporary directory. Run
`login.cjs` separately for authentication error and submission regressions.
