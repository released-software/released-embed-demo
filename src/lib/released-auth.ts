/**
 * Verified User tokens for the Released embed.
 *
 * Released can trust who your visitor is if your *server* vouches for them.
 * The flow:
 *
 *   1. A visitor loads a page. Your server works out who they are, using your
 *      own user source (`getCurrentUser` in src/lib/current-user.ts).
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
import { getCurrentUser } from "./current-user";

/** Released's endpoint for exchanging a shared secret for a user token. */
const TOKEN_ENDPOINT = "https://accounts.releasedhub.com/auth/api/impersonation/token";

/** Everything the page needs to render the embed for the current user. */
export interface ReleasedEmbedAuth {
  /** Verified User token, passed to `auth-token` on the custom elements. */
  token: string;
  /** Which Released channel (roadmap) to show. Not secret. */
  channelId: string;
}

/** Mints a Verified User token for the signed-in user. Never cache the result. */
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

  return { token, channelId: env.RELEASED_CHANNEL_ID };
}
