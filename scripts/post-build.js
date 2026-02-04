import {
  mkdirSync,
  copyFileSync,
  renameSync,
  existsSync,
  writeFileSync,
  readdirSync,
  readFileSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const distDir = resolve(rootDir, "dist");
const iconsDir = resolve(distDir, "icons");

mkdirSync(iconsDir, { recursive: true });

copyFileSync(
  resolve(rootDir, "chrome-extension/manifest.json"),
  resolve(distDir, "manifest.json")
);

if (existsSync(resolve(distDir, "src/sidepanel/index.html"))) {
  mkdirSync(resolve(distDir, "sidepanel"), { recursive: true });
  renameSync(
    resolve(distDir, "src/sidepanel/index.html"),
    resolve(distDir, "sidepanel/index.html")
  );
}

if (existsSync(resolve(distDir, "src/popup/index.html"))) {
  mkdirSync(resolve(distDir, "popup"), { recursive: true });
  renameSync(
    resolve(distDir, "src/popup/index.html"),
    resolve(distDir, "popup/index.html")
  );
}

const contentDir = resolve(distDir, "content");
mkdirSync(contentDir, { recursive: true });

const assetsCss = readdirSync(resolve(distDir, "assets"))
  .filter(f => f.endsWith(".css"))
  .map(f => resolve(distDir, "assets", f));

if (assetsCss.length > 0) {
  const contentCss = assetsCss.find(f => {
    const content = readFileSync(f, "utf8");
    return content.includes(".engageiq-button");
  });

  if (contentCss) {
    copyFileSync(contentCss, resolve(contentDir, "styles.css"));
  }
}

const createPlaceholderIcon = size => {
  const canvas = Buffer.alloc(size * size * 4);
  const color = [52, 152, 219];

  for (let i = 0; i < size * size; i++) {
    const offset = i * 4;
    canvas[offset] = color[0];
    canvas[offset + 1] = color[1];
    canvas[offset + 2] = color[2];
    canvas[offset + 3] = 255;
  }

  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  return Buffer.concat([pngHeader, canvas]);
};

const sizes = [16, 48, 128];
let iconsCreated = false;

for (const size of sizes) {
  const iconPath = resolve(iconsDir, `icon-${size}.png`);
  if (!existsSync(iconPath)) {
    try {
      const iconData = createPlaceholderIcon(size);
      writeFileSync(iconPath, iconData);
      iconsCreated = true;
    } catch (err) {
      console.warn(`Could not create icon-${size}.png: ${err.message}`);
    }
  }
}

console.log("✓ Post-build setup complete");
console.log("✓ Manifest copied");
console.log("✓ HTML files moved to correct locations");
console.log("✓ Content CSS copied to content/styles.css");
if (iconsCreated) {
  console.log("✓ Placeholder icons created");
} else {
  console.log("⚠ Icons already exist or could not be created");
  console.log(
    "  Add icon files manually: icon-16.png, icon-48.png, icon-128.png"
  );
}
