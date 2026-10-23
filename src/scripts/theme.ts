/**
 * Theme toggle (runs in the browser): flips the page between dark and light,
 * and tells the Released roadmap to match by updating its `color-scheme`
 * attribute.
 */
const page = document.querySelector<HTMLElement>(".page");

document.querySelector("#theme-toggle")?.addEventListener("click", () => {
  if (!page) return;
  const theme = page.dataset.theme === "dark" ? "light" : "dark";
  page.dataset.theme = theme;
  // The roadmap may not exist yet if the token is still loading; it picks up
  // the current theme when it is created (src/scripts/released-embed.ts).
  document.querySelector("#roadmap")?.setAttribute("color-scheme", theme);
});
