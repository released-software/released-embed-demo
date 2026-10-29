/**
 * Theme toggle (runs in the browser). Page chrome, not part of the embed.
 *
 * Flips the page between dark and light, and sets `color-scheme` on the
 * <released-page> to match. If the roadmap hasn't been inserted yet,
 * src/scripts/released-embed.ts picks up the page's theme when it inserts it.
 */
const page = document.querySelector<HTMLElement>(".page")!;

document.querySelector("#theme-toggle")!.addEventListener("click", () => {
  const theme = page.dataset.theme === "dark" ? "light" : "dark";
  page.dataset.theme = theme;
  for (const roadmap of document.querySelectorAll("released-page")) {
    roadmap.setAttribute("color-scheme", theme);
  }
});
