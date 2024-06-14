module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: true,
    // tsconfigRootDir: __dirname,
  },
  plugins: ["react", "@typescript-eslint", "simple-import-sort"],
  rules: {
    //
    //core rules
    "comma-dangle": ["error", "always-multiline"],
    "dot-notation": "off",
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "no-use-before-define": "off",
    "no-restricted-globals": [
      "error",
      {
        name: "logger",
        message:
          "This is a Foundry global which breaks tests.\n" +
          "Import `systemLogger` from `functions` instead.",
      },
    ],
    "no-useless-constructor": "off",
    // need to replace this with @typescript-eslint/no-restricted-imports so we
    // can allow type imports from lodash but this will require some eslint etc
    // version bumps
    // "no-restricted-imports": ["error", "lodash"],
    // typescript-eslint enforces using void to explicitely not await a promise
    "no-void": "off",

    //
    // TS
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-explicit-any": ["off"],
    // XXX ?
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { args: "none", ignoreRestSiblings: true },
    ],
    // stylistic
    "@typescript-eslint/no-empty-function": "off",

    "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
        overrides: {
          interface: {
            multiline: {
              delimiter: "semi",
              requireLast: true,
            },
            singleline: {
              delimiter: "semi",
              requireLast: true,
            },
          },
        },
      },
    ],
    "@typescript-eslint/dot-notation": [
      "error",
      // we also have noPropertyAccessFromIndexSignature: true in tsconfig which
      // effectively forces this on. See
      // https://typescript-eslint.io/rules/dot-notation#allowindexsignaturepropertyaccess
      { allowIndexSignaturePropertyAccess: true },
    ],

    //
    // react
    "react/prop-types": ["off"],
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": ["off"],
      },
    },
    {
      // vitest 1.x generates inline snapshots in backticks
      files: ["*.test.ts"],
      rules: {
        quotes: ["off", "double", { avoidEscape: true }],
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
