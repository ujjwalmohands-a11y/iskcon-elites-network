import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// @ts-ignore - The Cloudflare config type is incomplete in this version of OpenNext
export default defineCloudflareConfig({
  cloudflare: {
    useWorkerdCondition: false,
  },
});
