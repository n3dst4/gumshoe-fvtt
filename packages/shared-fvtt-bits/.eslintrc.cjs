module.exports = {
  extends: ["./dotfiles/import/.eslintrc.cjs"],
  ignorePatterns: [".eslintrc.cjs"],
  // add rules changes here
  rules: {
    // absolutely losing the plot here, I cannot make these rules switch off for
    // dotfiles/import/*. Had to resort to eslint comments.
    "@typescript-eslint/no-unsafe-member-access": ["off"],
    "unused-imports/no-unused-vars": "off",
  },
  root: true,
};
