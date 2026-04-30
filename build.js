const fs = require("fs");
const path = require("path");

function copy(src, dst) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠  Not found, skipping: ${src}`);
    return;
  }
  fs.cpSync(src, dst, { recursive: true, force: true });
  console.log(`✓  ${src} → ${dst}`);
}

// Next.js standalone output does not include these — copy them manually
copy(
  path.join(".next", "static"),
  path.join(".next", "standalone", ".next", "static")
);

copy("public", path.join(".next", "standalone", "public"));

console.log("Build copy complete.");
