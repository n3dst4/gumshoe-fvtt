module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
  ],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "comma-dangle": ["error", "always-multiline"],
  },
  globals: {
    Hooks: "readonly",
    CONFIG: "readonly",
    Actor: "readonly",
    ActorSheet: "readonly",
    Actors: "readonly",
    jQuery: "readonly",
    JQuery: "readonly",
    mergeObject: "readonly",
    Item: "readonly",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
