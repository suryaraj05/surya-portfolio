import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const backendRoot = path.resolve(root, "..");

const sources = [
  {
    from: path.join(backendRoot, "contracts", "openapi.json"),
    to: path.join(root, "src", "contracts", "openapi.json")
  },
  {
    from: path.join(backendRoot, "contracts", "types.ts"),
    to: path.join(root, "src", "contracts", "types.ts")
  }
];

for (const file of sources) {
  if (!fs.existsSync(file.from)) {
    console.warn(`Missing source: ${file.from}`);
    continue;
  }
  fs.copyFileSync(file.from, file.to);
  console.log(`Synced ${path.basename(file.from)} -> ${file.to}`);
}
