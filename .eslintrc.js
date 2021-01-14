module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
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
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": ["off"],
      },
    },
  ],
  globals: {
    // Hooks: "readonly",
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
