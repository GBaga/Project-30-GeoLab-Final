import { resolve as _resolve } from "path";

export const entry = "./src/index.js";
export const output = {
  path: _resolve(__dirname, "dist"),
  filename: "bundle.js",
};
export const module = {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ],
};
export const resolve = {
  extensions: [".js", ".jsx"], // Add .jsx to resolve extensions
};
