# Released Embed Demo

An [Astro](https://astro.build) app, deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/), that shows how to embed a [Released](https://released.so) portal with server-side user authentication. Your users get the roadmap and feedback form without logging in separately.

**Live Demo:** [https://embed-demo.released.so](https://embed-demo.released.so)

## Where to look

The parts you'll copy into your own app are small and commented:

| File | What it shows |
|------|---------------|
| [`src/lib/released-auth.ts`](src/lib/released-auth.ts) | **Verified User tokens.** Exchanges your shared secret for a token identifying the signed-in user. |
| [`src/lib/current-user.ts`](src/lib/current-user.ts) | Your app's signed-in user. A stub: replace `getCurrentUser()` with your own user source. |
| [`src/pages/api/released-token.ts`](src/pages/api/released-token.ts) | The endpoint (`POST /api/released-token`) that returns the token to the browser. |
| [`src/pages/index.astro`](src/pages/index.astro) | **The `<released-*>` custom elements.** In order: the script that starts the token request, the Released embed script (`embed.js`), and the `<released-page>` / `<released-form>` markup in a `<template>`, with every attribute documented. This is the snippet to copy. |
| [`src/scripts/released-embed.ts`](src/scripts/released-embed.ts) | Waits for the token, fills it into that markup, inserts it, and opens the form with `window.Released.show(...)`. |
| [`src/types/released.d.ts`](src/types/released.d.ts) | TypeScript type for `window.Released`. |

Everything else (`src/layouts`, `src/components`, `src/scripts/theme.ts`, `src/styles/global.css`) is page chrome. There is no UI framework.

## How it works

The page is static, so it can be cached and served from Cloudflare's edge. Only the token request runs per visitor:

```
Browser ── 1. GET / ─────────────────────▶ Cloudflare edge (static HTML + JS, cached)
   │
   ├─ 2. POST /api/released-token ───────▶ Worker (Astro endpoint, never cached)
   │                                         │ 3. POST shared secret + user ──▶ Released API
   │      ◀── 5. { token, channelId } ───────┘ 4. ◀── Verified User token
   │
   └─ 6. inserts <released-page auth-token=…> which talks to Released as that user
```

The shared secret never leaves the Worker. The browser only ever receives the short-lived token.

The token request is started by a small inline script in `<head>`, next to the Released embed script (both in `src/pages/index.astro`). That way the token loads alongside `embed.js` and the page instead of after them, and `released-embed.ts` just waits for the result. `embed.js` is loaded with `defer`, because it adds to `document.body`, which doesn't exist while `<head>` is being parsed. If your site has a Content Security Policy that blocks inline scripts, give the inline token script a nonce or move it into a same-origin `.js` file; otherwise the embed shows "Couldn't load the roadmap" and logs why.

Because the token is fetched after the page loads, the roadmap appears once that request finishes (a spinner shows meanwhile), and the page needs JavaScript. If you would rather have the token in the first response, render it in `index.astro` instead and drop the template (add `export const prerender = false`, call `getReleasedEmbedAuth()` in the frontmatter, and set `Cache-Control: private, no-store`). The trade-off is that the page can then no longer be cached.

## Getting started

### Prerequisites

- Node.js 22+
- A Released account with embed access
- Your Released credentials: shared secret, account ID and channel ID
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (only to deploy)

### Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # then fill in your Released credentials
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). `npm run dev` runs the server code in the real Workers runtime (workerd), so it behaves like production. `.dev.vars` is git-ignored.

### Configuration

| Name | Kind | Description |
|------|------|-------------|
| `RELEASED_SHARED_SECRET` | secret | Your Released shared secret. Never leaves the server. Set locally in `.dev.vars` (git-ignored) and in production with `wrangler secret put`. |
| `RELEASED_ACCOUNT_ID` | var | Your Released account ID. Set in `wrangler.jsonc`. |
| `RELEASED_CHANNEL_ID` | var | The channel whose roadmap to display. Set in `wrangler.jsonc`. |

`wrangler.jsonc` contains the IDs this demo uses; replace them with your own.

The form ID is a constant at the top of `src/pages/index.astro`.

## Deploy to Cloudflare

1. Put your account and channel IDs in the `vars` section of `wrangler.jsonc`.
2. Log in and store the shared secret (you'll be prompted for the value):
   ```bash
   npx wrangler login
   npx wrangler secret put RELEASED_SHARED_SECRET
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

Wrangler prints a `*.workers.dev` URL. To use your own domain, add a `routes` entry to `wrangler.jsonc` (an example is in the file) or attach one in the Cloudflare dashboard.

You can also connect the repository under **Workers & Pages** in the dashboard so every push to `main` deploys. Use `npm run build` as the build command, `npx wrangler deploy` as the deploy command, and `npx wrangler preview` for non-production branches. Previews don't use the production secret: set `RELEASED_SHARED_SECRET` for them with `npx wrangler preview base-config secret put RELEASED_SHARED_SECRET`, and add the preview domain to Released's trusted domains.

### Domain whitelist

After deploying, add your domain to the allowed origins in your Released embed settings to prevent `invalid_origin` errors. See the [Trusted Domains documentation](https://docs.released.so/guide/product/administration/trusted-domains).

## Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run deploy` | Build, then deploy with Wrangler |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Worker types (`wrangler types`), then runs `astro check` |

## Customization

### Dark mode

`<released-page>` follows the `color-scheme` attribute (`"light"` or `"dark"`), and you can change it at any time:

```ts
document.querySelector("released-page")?.setAttribute("color-scheme", "light");
```

### Feedback form

Render a `<released-form>` and open it from anywhere with the Released API:

```html
<released-form form-id="YOUR_FORM_ID" auth-token={token}></released-form>

<button id="feedback">Feedback</button>
<script>
  document.querySelector("#feedback")?.addEventListener("click", () => {
    window.Released?.show("form", "YOUR_FORM_ID");
  });
</script>
```

`window.Released.close("form", "YOUR_FORM_ID")` closes it.

### User information

Replace `getCurrentUser()` in `src/lib/current-user.ts` with your own user source (for example, give it the `request` from `src/pages/api/released-token.ts` and read your session), and return `null` for signed-out visitors:

```ts
export function getCurrentUser(request: Request): CurrentUser | null {
  const session = /* read your session cookie from request.headers.get("cookie") */;
  if (!session) return null;
  return { id: session.userId, email: session.email, name: session.name, avatarUrl: session.image };
}
```

## License

Apache-2.0

## Links

- [Released](https://released.so) - Product changelog and roadmap platform
- [Released Documentation](https://docs.released.so) - Full documentation
- [Astro](https://astro.build) - Framework
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - Deployment platform
