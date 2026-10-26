import type { APIRoute } from "astro";
import { getReleasedEmbedAuth } from "../../lib/released-auth";

// Per-visitor, so this runs on every request (the page itself is static).
export const prerender = false;

/**
 * POST /api/released-token: returns `{ token, channelId }` for the
 * signed-in user. Called by the inline script in src/pages/index.astro.
 *
 * It's a POST so it's never prefetched or cached by accident, and it sends no
 * CORS headers, so other websites can't read it from a visitor's browser.
 */
export const POST: APIRoute = async () => {
  const headers = { "Cache-Control": "private, no-store" };

  try {
    return Response.json(await getReleasedEmbedAuth(), { headers });
  } catch (error) {
    // Log the detail, but don't send internals to the browser.
    console.error("Could not get a Released token:", error);
    return Response.json({ error: "Failed to generate authentication token" }, { status: 500, headers });
  }
};
