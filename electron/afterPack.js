const fs = require("fs");
const path = require("path");

exports.default = async ({ appOutDir, packager }) => {
  const src = path.join(
    packager.projectDir,
    "node_modules",
    "better-sqlite3",
    "build",
    "Release",
    "better_sqlite3.node"
  );

  const dst = path.join(
    appOutDir,
    "resources",
    "app",
    ".next",
    "standalone",
    "node_modules",
    "better-sqlite3",
    "build",
    "Release",
    "better_sqlite3.node"
  );

  if (!fs.existsSync(src)) {
    console.warn("afterPack: better_sqlite3.node not found at", src);
    return;
  }

  if (!fs.existsSync(path.dirname(dst))) {
    console.warn("afterPack: destination directory not found:", path.dirname(dst));
    return;
  }

  fs.copyFileSync(src, dst);
  console.log("afterPack: ✓ Replaced better-sqlite3 with Electron-rebuilt version");
};
