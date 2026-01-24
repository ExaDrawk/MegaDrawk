const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), ".open-next");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Prepared .open-next output directory.");
