# Released Embed Demo

An [Astro](https://astro.build) app, deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/), that shows how to embed a [Released](https://released.so) portal with server-side user authentication. Your users get the roadmap and feedback form without logging in separately.

**Live Demo:** [https://embed-demo.released.so](https://embed-demo.released.so)

## Where to look

The parts you'll copy into your own app are small and commented:

| File | What it shows |
|------|---------------|
| [`src/lib/released-auth.ts`](src/lib/released-auth.ts) | **Verified User tokens.** Exchanges your shared secret for a token identifying the signed-in user. Replace `getCurrentUser()` with your real session lookup. |
| [`src/pages/api/released-token.ts`](src/pages/api/released-token.ts) | The endpoint (`POST /api/released-token`) that returns the token to the browser. |
| [`src/scripts/released-embed.ts`](src/scripts/released-embed.ts) | **The `<released-*>` custom elements.** Fetches the token, creates `<released-page>` and `<released-form>` with it, and opens the form with `window.Released.show(...)`. Every attribute is documented inline. |
| [`src/layouts/Layout.astro`](src/layouts/Layout.astro) | Loads the Released embed script (`embed.js`) in `<head>`. |
| [`src/types/released.d.ts`](src/types/released.d.ts) | TypeScript type for `window.Released`. |

Everything else (`src/pages/index.astro`, `src/components`, `src/scripts/theme.ts`, `src/styles/global.css`) is page chrome. There is no UI framework.

## How it works

The page is static, so it can be cached and served from Cloudflare's edge. Only the token request runs per visitor:

```
Browser ── 1. GET / ─────────────────────▶ Cloudflare edge (static HTML + JS, cached)
   │
   ├─ 2. POST /api/released-token ───────▶ Worker (Astro endpoint, never cached)
   │                                         │ 3. POST shared secret + user ──▶ Released API
   │      ◀── 5. { token, channelId, … } ────┘ 4. ◀── Verified User token
   │
   └─ 6. creates <released-page auth-token=…> which talks to Released as that user
```

The shared secret never leaves the Worker. The browser only ever receives the short-lived token.

The token request is started by a small inline script in `<head>`, before the blocking Released embed script (see `src/pages/index.astro`). That way fetching the token and downloading `embed.js` overlap instead of running one after the other, and `released-embed.ts` just waits for the result.

Because the token is fetched after the page loads, the roadmap appears once that request finishes (a spinner shows meanwhile), and the page needs JavaScript. If you would rather have the token in the first response, render it in `index.astro` instead (add `export const prerender = false`, call `getReleasedEmbedAuth()` in the frontmatter, and set `Cache-Control: private, no-store`). The trade-off is that the page can then no longer be cached.

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

All three are Worker secrets, so none of them are committed to the repo.

| Name | Description |
|------|-------------|
| `RELEASED_SHARED_SECRET` | Your Released shared secret. Never leaves the server. |
| `RELEASED_ACCOUNT_ID` | Your Released account ID. Never leaves the server. |
| `RELEASED_CHANNEL_ID` | The channel whose roadmap to display. Not confidential: it is sent to the browser as an attribute on `<released-page>`. Kept out of the repo only for tidiness. |

Locally they come from `.dev.vars` (git-ignored); in production, from `wrangler secret put`.

The form ID is a constant at the top of `src/pages/index.astro`.

## Deploy to Cloudflare

1. Log in and store the three secrets (you'll be prompted for each value):
   ```bash
   npx wrangler login
   npx wrangler secret put RELEASED_SHARED_SECRET
   npx wrangler secret put RELEASED_ACCOUNT_ID
   npx wrangler secret put RELEASED_CHANNEL_ID
   ```
2. Deploy:
   ```bash
   npm run deploy
   ```

Wrangler prints a `*.workers.dev` URL. To use your own domain, add a `routes` entry to `wrangler.jsonc` (an example is in the file) or attach one in the Cloudflare dashboard.

You can also connect the repository under **Workers & Pages** in the dashboard so every push to `main` deploys. Use `npm run build` as the build command and `npx wrangler deploy` as the deploy command.

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

`<released-page>` follows the `color-scheme` attribute (`"light"` or `"dark"`). The demo's theme toggle updates it at runtime:

```ts
document.querySelector("#roadmap")?.setAttribute("color-scheme", "light");
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

Edit `getCurrentUser()` in `src/lib/released-auth.ts` (and give it the `request` from `src/pages/api/released-token.ts`) to return the user from your real session, and return `null` for signed-out visitors:

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
