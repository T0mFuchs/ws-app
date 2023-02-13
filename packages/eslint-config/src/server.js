module.exports = {
  extends: [
    
    "plugin:unicorn/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:security/recommended",
    "plugin:n/recommended",

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

    "unicorn",
    "@typescript-eslint",
    "prettier",
    "prettier",
    "import",
    "promise",
    "security",
    "n",

  ],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
