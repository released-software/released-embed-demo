import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Runs the app on Cloudflare Workers. `astro dev` and `astro preview` use the
  // real Workers runtime (workerd), so local behaviour matches production.
  // Worker settings (name, vars, secrets) live in wrangler.jsonc.
  //
  // This demo has no image optimisation, so don't set up the Cloudflare Images
  // binding for it.
  adapter: cloudflare({ imageService: "passthrough" }),

  // This demo doesn't use Astro sessions. Turning them off stops the adapter
  // from provisioning a Cloudflare KV namespace for them on deploy.
  session: false,
});
