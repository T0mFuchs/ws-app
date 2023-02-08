import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
} from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetUno(),
  ],
  transformers: [transformerAttributifyJsx()],
  shortcuts: [],
});
