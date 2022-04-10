import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { fileURLToPath } from "url";

const isProduction =
  (process.env.NODE_ENV || "").toLowerCase() === "production";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: isProduction ? "production" : "development",
  entry: "./src/investigator.ts",
  output: {
    path: path.join(__dirname, "build"),
    filename: "investigator.js",
    // this is needed so we can reset __webpack_public_path__ at runtime
    publicPath: "",
  },
  devtool: isProduction ? undefined : "source-map",
  module: {
    rules: [
      { test: /\.js$/, type: "javascript/auto" },
      {
        test: /\.[jt]sx?$/,
        exclude: [
          /node_modules/,
          /tests/,
          /css-reset/,
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },

      {
        test: /\.(eot|ttf|woff|woff2|png)$/,
        loader: "file-loader",
      },
      // svgs
      // svgs loaded from stylesheets come in via file-loader
      {
        test: /\.svg$/,
        loader: "file-loader",
        issuer: /\.(le|c)ss$/,
      },
      // svgs loaded from source code come in via react-svg-loader
      {
        test: /\.svg$/,
        loader: "react-svg-loader",
        issuer: /\.[jt]sx?$/,
      },
      // load markdown
      {
        test: /\.(md|markdown)$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "markdown-loader",
            options: {
              /* your options here */
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css", ".ts", ".tsx"],
    alias: {
      // aliasing react and react-dom helps when you're working with `npm link`
      // so that external components see the same react as your app rather than
      // the one that might have been installed in their local node_modules
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV ?? "development",
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/**/*.{ts,tsx,js,jsx}",
      },
    }),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // cache: true,
        parallel: true,
        // sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};
