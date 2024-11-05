import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      include: ['components/depth-tracker.tsx', 'components/client-pages-root.tsx', "pages/long-page.tsx"],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
});
