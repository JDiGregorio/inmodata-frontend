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

This is component integration coverage, not a real-account end-to-end test of Google
Maps. Backend GraphQL and database authorization are tested separately in Sail.
