import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import unocss from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetWind,
  transformerAttributifyJsx,
  transformerCompileClass,
} from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
      transformers: [transformerAttributifyJsx(), transformerCompileClass()],
      shortcuts: [],
    }),
    react(),
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
