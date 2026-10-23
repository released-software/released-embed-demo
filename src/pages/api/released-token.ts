import type { APIRoute } from "astro";
import { getReleasedEmbedAuth } from "../../lib/released-auth";

// The page itself is static and cached; this endpoint is the only part that
// runs per visitor, so it has to run on every request.
export const prerender = false;

/**
 * POST /api/released-token
 *
 * Returns `{ token, channelId, user }` (see `ReleasedEmbedAuth`) for the
 * signed-in user. The browser calls it after the page loads and hands the token
 * to the `<released-*>` elements (src/scripts/released-embed.ts).
 *
 * It is a POST so it is never prefetched or cached by accident, and it sends
 * no CORS headers, so other websites can't read the response from a visitor's
 * browser. The response is user-specific, so it must never be cached.
 */
export const POST: APIRoute = async () => {
  const headers = { "Cache-Control": "private, no-store" };

  try {
    const auth = await getReleasedEmbedAuth();
    return Response.json(auth, { headers });
  } catch (error) {
    console.error("Could not get a Released token:", error);
    // Log the detail, but don't send internals to the browser.
    return Response.json({ error: "Failed to generate authentication token" }, { status: 500, headers });
  }
};
