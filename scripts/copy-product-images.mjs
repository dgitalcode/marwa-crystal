import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcDir = join(root, "images des collections");
const destDir = join(root, "public", "images", "products");

const mapping = {
  "cristal-service-stand-rouge.jpg": "WhatsApp Image 2026-06-23 at 20.25.35.jpeg",
  "cristal-bonbonniere-or.jpg": "WhatsApp Image 2026-06-23 at 20.26.03.jpeg",
  "cristal-bonbonnieres-trio.jpg": "WhatsApp Image 2026-06-23 at 20.26.14 (2).jpeg",
  "cristal-stand-vert.jpg": "WhatsApp Image 2026-06-23 at 20.26.15.jpeg",
  "cristal-carafe-rouge.jpg": "WhatsApp Image 2026-06-23 at 20.26.14.jpeg",
  "porcelaine-service-41.jpg": "WhatsApp Image 2026-06-23 at 20.25.36.jpeg",
  "porcelaine-bol-imari.jpg": "WhatsApp Image 2026-06-23 at 20.25.42.jpeg",
  "porcelaine-boites-trio.jpg": "WhatsApp Image 2026-06-23 at 20.26.14 (1).jpeg",
  "porcelaine-service-ab02.jpg": "WhatsApp Image 2026-06-23 at 20.26.37.jpeg",
  "porcelaine-tajines-b09.jpg": "WhatsApp Image 2026-06-23 at 20.27.46.jpeg",
  "lustre-5233.jpg": "WhatsApp Image 2026-06-23 at 20.27.33.jpeg",
  "plafonnier-md5292.jpg": "WhatsApp Image 2026-06-23 at 20.27.34.jpeg",
  "suspension-5807-3.jpg": "WhatsApp Image 2026-06-23 at 20.27.35.jpeg",
  "lampe-5000t-81.jpg": "WhatsApp Image 2026-06-23 at 20.27.35 (1).jpeg",
  "suspension-5807a-3.jpg": "WhatsApp Image 2026-06-23 at 20.27.35 (2).jpeg",
  "suspension-5133.jpg": "WhatsApp Image 2026-06-23 at 20.27.35 (3).jpeg",
  "suspension-5134.jpg": "WhatsApp Image 2026-06-23 at 20.27.36.jpeg",
  "suspension-5159-t.jpg": "WhatsApp Image 2026-06-23 at 20.27.36 (1).jpeg",
  "lustre-5288c.jpg": "WhatsApp Image 2026-06-23 at 20.27.38.jpeg",
  "plafonnier-5650b.jpg": "WhatsApp Image 2026-06-23 at 20.27.38 (1).jpeg",
  "plafonnier-5650l.jpg": "WhatsApp Image 2026-06-23 at 20.27.38 (2).jpeg",
  "lustre-5320b.jpg": "WhatsApp Image 2026-06-23 at 20.27.39.jpeg",
  "lustre-5180.jpg": "WhatsApp Image 2026-06-23 at 20.27.41.jpeg",
  "lustre-5186.jpg": "WhatsApp Image 2026-06-23 at 20.27.43.jpeg",
};

mkdirSync(destDir, { recursive: true });

for (const [destName, sourceName] of Object.entries(mapping)) {
  copyFileSync(join(srcDir, sourceName), join(destDir, destName));
}

console.log(`Copied ${Object.keys(mapping).length} images to ${destDir}`);
