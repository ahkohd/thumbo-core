const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const path = require("path");

module.exports = () => {
  return {
    entry: {
      thumbo: "./src/thumbo.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "../"), // (where the cargo.toml file is located)
      }),
      // new webpack.ProvidePlugin({
      //   TextDecoder: ["text-encoding", "TextDecoder"],
      //   TextEncoder: ["text-encoding", "TextEncoder"],
      // }),
    ],
    experiments: {
      asyncWebAssembly: true,
    },
  };
};