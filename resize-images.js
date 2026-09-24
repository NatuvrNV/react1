/**
 * resize-images.js
 * -----------------
 * Batch-generates responsive WebP variants (400w, 800w, 1600w) of every
 * image under a source folder, so the site can serve srcset instead of
 * one full-resolution file to every device.
 *
 * WHY THIS EXISTS
 * ----------------
 * The Core Web Vitals report found that project/product gallery images
 * use zero srcset — every visitor, including phones, downloads the same
 * full-resolution file. This script produces the smaller files that
 * srcset needs. It does NOT change any of your React code by itself —
 * see "AFTER YOU RUN THIS" below.
 *
 * INSTALL (one-time)
 * -------------------
 *   npm install --save-dev sharp
 *
 * USAGE
 * -----
 *   node resize-images.js <source-folder> [output-folder]
 *
 * Examples:
 *   node resize-images.js public/assets/Products
 *   node resize-images.js public/assets/Products public/assets/Products
 *     (output defaults to the same folder as source — variants are
 *      written ALONGSIDE originals, never overwriting them)
 *
 * WHAT IT DOES
 * ------------
 * For every .jpg/.jpeg/.png/.webp file found (recursively), generates:
 *   original-name-400.webp
 *   original-name-800.webp
 *   original-name-1600.webp
 * in the same relative folder structure, at the output path.
 * Skips a file+width combination that's already been generated (safe to
 * re-run after adding new images — it won't redo existing work).
 * Never touches or deletes your original source images.
 *
 * AFTER YOU RUN THIS
 * ------------------
 * 1. Check the output folder — confirm the -400/-800/-1600.webp files
 *    are actually there and look correct (open a few).
 * 2. Only THEN deploy the updated SingleProduct.js / SingleProject.js
 *    code (provided separately) that references these filenames via
 *    srcset. If you deploy the code before running this script (or
 *    before confirming it ran successfully), gallery images will
 *    break, because the code will point at files that don't exist yet.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const WIDTHS = [400, 800, 1600];
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function findImages(dir) {
  const results = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findImages(fullPath)));
    } else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      // Skip files that are already-generated variants, so re-running
      // this script doesn't try to resize its own output.
      if (/-(400|800|1600)\.webp$/i.test(entry.name)) continue;
      results.push(fullPath);
    }
  }
  return results;
}

async function processImage(sourcePath, sourceRoot, outputRoot) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const parsed = path.parse(relativePath);
  const outputDir = path.join(outputRoot, parsed.dir);

  await fs.promises.mkdir(outputDir, { recursive: true });

  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  let generated = 0;
  let skippedNarrower = 0;

  for (const width of WIDTHS) {
    const outputFile = path.join(outputDir, `${parsed.name}-${width}.webp`);

    if (fs.existsSync(outputFile)) {
      continue; // already generated in a previous run
    }

    // Don't upscale — if the source is narrower than a target width,
    // skip that width rather than blowing the image up (which would
    // just waste bytes on fake detail).
    if (metadata.width && metadata.width < width) {
      skippedNarrower++;
      continue;
    }

    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputFile);

    generated++;
  }

  return { generated, skippedNarrower };
}

async function main() {
  const [, , sourceArg, outputArg] = process.argv;

  if (!sourceArg) {
    console.error("Usage: node resize-images.js <source-folder> [output-folder]");
    process.exit(1);
  }

  const sourceRoot = path.resolve(sourceArg);
  const outputRoot = path.resolve(outputArg || sourceArg);

  if (!fs.existsSync(sourceRoot)) {
    console.error(`Source folder not found: ${sourceRoot}`);
    process.exit(1);
  }

  console.log(`Scanning ${sourceRoot} ...`);
  const images = await findImages(sourceRoot);
  console.log(`Found ${images.length} source image(s).\n`);

  let totalGenerated = 0;
  let totalSkippedNarrower = 0;
  let totalErrors = 0;

  for (const [index, imagePath] of images.entries()) {
    const relative = path.relative(sourceRoot, imagePath);
    process.stdout.write(`[${index + 1}/${images.length}] ${relative} ... `);

    try {
      const { generated, skippedNarrower } = await processImage(
        imagePath,
        sourceRoot,
        outputRoot
      );
      totalGenerated += generated;
      totalSkippedNarrower += skippedNarrower;

      if (generated === 0 && skippedNarrower === 0) {
        console.log("already done, skipped");
      } else {
        console.log(
          `${generated} variant(s) created` +
            (skippedNarrower > 0
              ? `, ${skippedNarrower} width(s) skipped (source too narrow)`
              : "")
        );
      }
    } catch (err) {
      totalErrors++;
      console.log(`ERROR: ${err.message}`);
    }
  }

  console.log("\n--- Done ---");
  console.log(`Variants generated: ${totalGenerated}`);
  console.log(`Skipped (source narrower than target): ${totalSkippedNarrower}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(
    `\nNext step: spot-check a few generated files in ${outputRoot}, then let me know so I can update the component code to reference them.`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
