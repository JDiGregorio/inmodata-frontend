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
