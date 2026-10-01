---
name: update-npm-dependencies
description: Update this repo's npm dependencies (a version bump or a security fix) and verify the app still installs, lints, typechecks and builds. Used by the dependabot sweep; also fine to run by hand.
---

# Update npm dependencies

A single-directory Next.js app (App Router), one `package.json`, one
`package-lock.json`. npm only.

## Making the change

1. Edit the version range in `package.json`, keeping the existing range
   operator (`^1.2.0` → `^1.4.0`). Move `react` and `react-dom` together, and
   their `@types/react` / `@types/react-dom` with them. Move `next` with any
   `@next/*` or `eslint-config-next` package.
2. Regenerate the lockfile: `npm install`. Commit `package-lock.json` along
   with `package.json`; never hand-edit the lockfile.
3. For a security fix to a transitive dependency, prefer raising the direct
   dependency that pulls it in. Only if no release of that parent allows the
   fixed version, add an `overrides` entry in `package.json`, scoped as
   narrowly as possible, and say why in your notes.

## Verification checklist

Run every step, in order, and fix what fails before committing. They are the
same steps CI runs (`.github/workflows/ci.yml`):

1. Install: `npm ci`, which must succeed against the committed lockfile.
2. Lint: `npm run lint`.
3. Typecheck: `npm run typecheck`.
4. Build: `npm run build`. It needs no environment variables. The
   `RELEASED_*` values in `.env.example` are read only at request time.

There are no tests.

## Install scripts

`.npmrc` sets `ignore-scripts=true`, so no dependency's install scripts run
(today the only one is `unrs-resolver`'s `postinstall`, via
`eslint-config-next`). Install, lint, typecheck and build all pass without
them. Do not remove that setting, add an `allowScripts` allowlist, or pass
`--ignore-scripts=false`. If a new or upgraded package needs its install
script to work, stop and report it instead.

## Release-age cooldown

`.npmrc` sets `min-release-age=7`, so npm only resolves versions published at
least 7 days ago. For an ordinary version bump, if the version you want is
newer than that, `npm install` will refuse it: report that and wait.

A security fix may skip the cooldown, for the patched package only. Exempt it
for that one command, e.g.
`npm install --min-release-age-exclude=<package>`; its own dependencies still
follow the window. Don't change `min-release-age` or add
`min-release-age-exclude` to `.npmrc`, and say in your notes which package
skipped the cooldown and why.
