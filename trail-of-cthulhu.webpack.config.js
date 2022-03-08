const coreConfig = require("./webpack.config");
const path = require("path");

module.exports = {
  ...coreConfig,
  entry: "./src/sytems/trailOfCthulhu.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "trailOfCthulhu.js",
    // this is needed so we can reset __webpack_public_path__ at runtime
    publicPath: "",
  },
};
