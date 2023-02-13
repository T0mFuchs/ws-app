module.exports = {
  extends: [
    "@unocss",
    "unocss",
    "plugin:unicorn/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:security/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  env: {
    "es2022": true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@unocss",
    "unocss",
    "unicorn",
    "@typescript-eslint",
    "prettier",
    "prettier",
    "import",
    "promise",
    "security",
    "jsx-a11y",
    "react",
    "react-hooks",
  ],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
}