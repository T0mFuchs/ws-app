import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import unocss from "unocss/vite";
import {
  presetIcons,
  presetWind,
  presetAttributify,
  transformerAttributifyJsx,
} from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    unocss({
      presets: [
        presetWind(), // tailwindcss preset
        presetAttributify(),
        presetIcons({
          extraProperties: {
            display: "inline-block",
            "vertical-align": "middle",
          },
        }),
      ],
      transformers: [transformerAttributifyJsx()],
      shortcuts: [],
    }),
    react({
      tsDecorators: true, // enable decorators for css in js
    }),
  ],
  //? replace react with preact on build to reduce bundle size by 40kb
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h } from 'preact'`,
  },
  resolve: {
    alias: {
      "react/jsx-runtime.js": "preact/compat/jsx-runtime",
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
});
