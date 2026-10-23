/**
 * Verified User tokens for the Released embed.
 *
 * Released can trust who your visitor is if your *server* vouches for them.
 * The flow:
 *
 *   1. A visitor loads a page. Your server works out who they are from your own
 *      session (see `getCurrentUser` below).
 *   2. Your server asks Released for a short-lived token for that user, proving
 *      its identity with your shared secret.
 *   3. The token is handed to the `<released-*>` elements in the browser via
 *      their `auth-token` attribute, and Released treats the visitor as that
 *      verified user.
 *
 * The shared secret must never reach the browser. This module only runs inside
 * the token endpoint (`src/pages/api/released-token.ts`), and the secret is
 * read from the Cloudflare Worker environment.
 */
import { env } from "cloudflare:workers";

/** Released's endpoint for exchanging a shared secret for a user token. */
const TOKEN_ENDPOINT = "https://accounts.releasedhub.com/auth/api/impersonation/token";

/** The user we vouch for. Map this from your own auth system. */
export interface CurrentUser {
  /** Your stable, unique ID for the user. */
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

/**
 * TODO: replace with your real session lookup.
 *
 * This demo always signs in the same fictional user. In a real app, read the
 * request's cookie or session here (pass in the endpoint's
 * `request` or `cookies`), and return `null` for signed-out visitors so that no token
 * is issued for them.
 */
export function getCurrentUser(): CurrentUser | null {
  return {
    id: "user_12345",
    email: "john.doe@doesnotexist.released.site",
    name: "John Doe",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
  };
}

/** Everything the page needs to render the embed for the current user. */
export interface ReleasedEmbedAuth {
  /** Verified User token, passed to `auth-token` on the custom elements. */
  token: string;
  /** Which Released channel (roadmap) to show. Not secret. */
  channelId: string;
  /** Display details for the greeting on the page. */
  user: Pick<CurrentUser, "name">;
}

/**
 * Mints a Verified User token for the signed-in user.
 *
 * Called by the token endpoint, never while rendering the page, so the page
 * HTML stays identical for everyone and can be cached. Tokens are per-user, so
 * the endpoint's response must not be cached.
 */
export async function getReleasedEmbedAuth(): Promise<ReleasedEmbedAuth> {
  const user = getCurrentUser();
  if (!user) {
    // Signed-out visitors get no token. Handle this however your app needs,
    // e.g. redirect to login or render the embed anonymously.
    throw new Error("Not signed in");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Proves to Released that this request comes from your server.
      Authorization: `Bearer ${env.RELEASED_SHARED_SECRET}`,
    },
    body: JSON.stringify({
      account_id: env.RELEASED_ACCOUNT_ID,
      user_id: user.id,
      user_email: user.email,
      // Shown in Released next to this user's votes, comments and feedback.
      profile: { name: user.name, avatar_url: user.avatarUrl },
    }),
  });

  if (!response.ok) {
    throw new Error(`Released token request failed: ${response.status} ${response.statusText}`);
  }

  // The response body is the token itself, as a JSON string.
  const token = (await response.json()) as string;

  return { token, channelId: env.RELEASED_CHANNEL_ID, user: { name: user.name } };
}
