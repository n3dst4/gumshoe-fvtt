const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const morgan = require("morgan");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// const eslintConfig = require("./.eslintrc");

const isProduction =
  (process.env.NODE_ENV || "").toLowerCase() === "production";

const apiHost = process.env.WSL_HOST_IP || "localhost";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/main.tsx",
  output: {
    path: __dirname + "/build",
    filename: "[name].[hash:8].js",
  },
  devtool: isProduction ? "none" : "source-map",
  module: {
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.[jt]sx?$/,
      //   exclude: [
      //     /node_modules/,
      //     /\/tests\//,
      //     /react-login-form/,
      //     /react-gatling-button/,
      //     /react-toolbars/,
      //     /react-css-reset/,
      //     /react-nav-bar/,
      //     /icons/,
      //   ],
      //   use: {
      //     loader: "tslint-loader",
      //     options: {
      //       emitErrors: true,
      //       failOnHint: true,

      //     },
      //   },
      // },
      {
        test: /\.[jt]sx?$/,
        include: /node_modules\/@sportingsolutions/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
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
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
      // file loader
      {
        test: /\.(eot|ttf|woff|woff2|png)$/,
        loader: "file-loader",
      },
      // svgs
      // svgs loaded from stylesheets come in via file-loader
      {
        test: /\.svg$/,
        loader: "file-loader",
        issuer: {
          test: /\.(le|c)ss$/,
        },
      },
      // svgs loaded from source code come in via react-svg-loader
      {
        test: /\.svg$/,
        loader: "react-svg-loader",
        issuer: {
          test: /\.[jt]sx?$/,
        },
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
      "react": path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      IMAGE_TAG: "none found - probably not an automated build",
    }),
    new webpack.ProvidePlugin({
      "React": "react",
      "ReactDOM": "react-dom",
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      title: "Trade",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
  ],
  performance: {
    hints: false,
  },
  devServer: {
    port: 3002,
    host: "localhost",
    open: true,
    hot: true,
    clientLogLevel: "debug",
    overlay: {
      warnings: true,
      errors: true,
    },
    before: (app) => {
      app.use(morgan(":http-version :method :url :status :req[X-Auth-Username] :req[X-Auth-Token]"));
    },
    proxy: {
      "/apis/handball": {
        target: `http://${apiHost}:8105`,
        pathRewrite: {"^/apis/handball" : ""},
      },
      "/apis/basketball": {
        target: `http://${apiHost}:8103`,
        pathRewrite: {"^/apis/basketball" : ""},
      },
      "/apis/usersettings": {
        target: `https://modelappcui.sportingsolutions.com/usersettings`,
        pathRewrite: {"^/apis/usersettings" : ""},
        changeOrigin: true, 
      },
      "/apis/gateway": {
        target: "http://connectappcui.sportingsolutions.com/gateway",
        pathRewrite: {"^/apis/gateway" : ""},
      },
      "/apis/basketballPlayers": {
        target: "http://basketballappcui.sportingsolutions.com/players",
        pathRewrite: {"^/apis/basketballPlayers" : ""},
      },
      "/apis/pricingapi": {
        target: "http://connectappcui.sportingsolutions.com/pricingapi",
        pathRewrite: {"^/apis/pricingapi" : ""},
      },
    },
  },

};
