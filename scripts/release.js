/**
 * Automatically update's some fields at the project's package.json
 */

const easyjson = require("easyjson");
easyjson
  .path("pkg/package.json")
  .modify("module", "thumbo.js")
  .modify("files", [
    ...easyjson.path("pkg/package.json").get("files"),
    "thumbo.js",
  ]);
