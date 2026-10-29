/**
 * Type declarations for the Released embed script
 * (https://embed.released.so/1/embed.js).
 *
 * The script defines the `<released-page>` and `<released-form>` custom
 * elements (documented where they're written, in `src/pages/index.astro`) and a
 * global `window.Released` object for opening and closing them. TypeScript
 * doesn't know about the global, so we describe it here.
 */
import type { ReleasedEmbedAuth } from "../lib/released-auth";

declare global {
  interface Window {
    /** The token request, started by the inline script in src/pages/index.astro. */
    releasedAuth?: Promise<ReleasedEmbedAuth>;

    /** Present once the embed script has loaded, hence optional. */
    Released?: {
      /** e.g. `show("form", formId)` opens a `<released-form>` as a dialog. */
      show: (type: string, id: string) => void;
      close: (type: string, id: string) => void;
    };
  }
}
