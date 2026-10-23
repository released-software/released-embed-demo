/**
 * Adds the Released embed to the page (runs in the browser).
 *
 * The page HTML is static and the same for every visitor, so it can't contain
 * a Verified User token. Instead we:
 *
 *   1. ask our own server for the signed-in user's token (POST /api/released-token,
 *      see src/pages/api/released-token.ts and src/lib/released-auth.ts). The
 *      request is started early by an inline script in src/pages/index.astro;
 *      this file just waits for it.
 *   2. create the `<released-page>` and `<released-form>` elements with that token
 *
 * The elements are created only once the token is in hand, so they never render
 * as an anonymous visitor first. The embed script (loaded in the layout's
 * <head>) has already defined them by then.
 */
import type { ReleasedEmbedAuth } from "../lib/released-auth";

const area = document.querySelector<HTMLElement>("#embed-area")!;
const formId = area.dataset.formId!;

/** Create an element and set its attributes. */
function createElement(tag: string, attributes: Record<string, string>): HTMLElement {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

/** The token request, started early by index.astro, or started now if that didn't run. */
function getAuth(): Promise<ReleasedEmbedAuth> {
  return (
    window.releasedAuth ??
    fetch("/api/released-token", { method: "POST" }).then((response) => {
      if (!response.ok) throw new Error(`Token request failed (${response.status})`);
      return response.json() as Promise<ReleasedEmbedAuth>;
    })
  );
}

/** Wait for the token and show the embed, or an error if that fails. */
async function loadEmbed() {
  try {
    const { token, channelId, user } = await getAuth();

    // The roadmap. Attributes:
    //   channel-id    which Released channel to show
    //   auth-token    the Verified User token, so visitors are signed in as the
    //                 user your server vouched for
    //   color-scheme  "light" | "dark"; src/scripts/theme.ts keeps it in sync
    //                 with the page, using the id below
    //   header        "true" | "false"; whether to show Released's own header
    //   modules       which sections to show, e.g. "roadmap"
    const roadmap = createElement("released-page", {
      id: "roadmap",
      "channel-id": channelId,
      "auth-token": token,
      "color-scheme": document.querySelector<HTMLElement>(".page")?.dataset.theme ?? "dark",
      header: "false",
      modules: "roadmap",
    });
    roadmap.style.cssText = "width: 100%; min-height: 800px";

    // A feedback form, shown inline. The nav's Feedback button also opens it as
    // a dialog (see below). Attributes: form-id, auth-token (as above),
    // sub-title (heading text).
    const form = createElement("released-form", {
      "form-id": formId,
      "auth-token": token,
      "sub-title": "Embed this form in your website or app to collect feedback from customers or stakeholders.",
    });

    area.replaceChildren(roadmap, form);

    // Personalise the greeting now that we know who the user is.
    const greeting = document.querySelector<HTMLElement>("#greeting");
    if (greeting) {
      greeting.querySelector("#user-name")!.textContent = user.name;
      greeting.hidden = false;
    }
  } catch (error) {
    console.error("Could not load the Released embed:", error);
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "Couldn't load the roadmap. Please try again.";
    area.replaceChildren(message);
  }
}

// Feedback button: open the <released-form> as a dialog. `window.Released` is
// defined by the embed script.
document.querySelector("#feedback-button")?.addEventListener("click", () => {
  window.Released?.show("form", formId);
});

void loadEmbed();
