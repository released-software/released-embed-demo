/**
 * Inserts the Released embed once the visitor's token has loaded (runs in the
 * browser).
 *
 * The token request was started by the inline script at the top of
 * src/pages/index.astro; here we wait for it, copy the <released-*> markup out
 * of the <template> on that page, fill in the token, and insert it. The
 * elements are only inserted with the token already set, so they never render
 * as an anonymous visitor first.
 */
const area = document.querySelector<HTMLElement>("#embed-area")!;
const template = document.querySelector<HTMLTemplateElement>("#released-embed")!;

async function insertEmbed() {
  try {
    // Set by the inline script in src/pages/index.astro. It's missing if that
    // script wasn't copied, or was blocked (e.g. by a Content Security Policy).
    if (!window.releasedAuth) {
      throw new Error("Token request not started: add the inline script from src/pages/index.astro before embed.js");
    }
    const { token, channelId } = await window.releasedAuth;

    // Template contents stay inert until inserted, so the elements start up
    // with these attributes already in place.
    const embed = template.content.cloneNode(true) as DocumentFragment;
    for (const element of embed.querySelectorAll("[channel-id]")) {
      element.setAttribute("channel-id", channelId);
    }
    for (const element of embed.querySelectorAll("[auth-token]")) {
      element.setAttribute("auth-token", token);
    }
    // Match the page's current theme (the visitor may have switched it while
    // the token was loading).
    const theme = document.querySelector<HTMLElement>(".page")!.dataset.theme!;
    for (const element of embed.querySelectorAll("[color-scheme]")) {
      element.setAttribute("color-scheme", theme);
    }
    area.replaceChildren(embed);
  } catch (error) {
    console.error("Could not load the Released embed:", error);
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "Couldn't load the roadmap. Please try again.";
    area.replaceChildren(message);
  }
}

// Feedback button: open the <released-form> as a dialog, using the form-id
// from the template.
document.querySelector("#feedback-button")!.addEventListener("click", () => {
  const formId = template.content.querySelector("released-form")!.getAttribute("form-id")!;
  window.Released?.show("form", formId);
});

void insertEmbed();
