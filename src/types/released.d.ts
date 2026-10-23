/**
 * Type declarations for the Released embed script
 * (https://embed.released.so/1/embed.js).
 *
 * The script defines the `<released-page>` and `<released-form>` custom
 * elements (documented where they're created, in `src/scripts/released-embed.ts`) and a
 * global `window.Released` object for opening and closing them. TypeScript
 * doesn't know about the global, so we describe it here.
 */
import type { ReleasedEmbedAuth } from "../lib/released-auth";

declare global {
  interface Window {
    /**
     * The in-flight token request, started by an inline script in
     * src/pages/index.astro so it overlaps with loading the embed script.
     */
    releasedAuth?: Promise<ReleasedEmbedAuth>;

    /** Present once the embed script has loaded, hence optional. */
    Released?: {
      /** e.g. `show("form", formId)` opens a `<released-form>` as a dialog. */
      show: (type: string, id: string) => void;
      close: (type: string, id: string) => void;
    };
  }
}
