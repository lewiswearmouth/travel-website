import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const photosRoot = path.resolve("public", "photos");
const photosDataPath = path.resolve("lib", "photos.ts");
const heicPattern = /\.(heic|heif)$/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && heicPattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function jpgPathFor(filePath) {
  return filePath.replace(heicPattern, ".jpg");
}

async function convertFile(filePath) {
  const outputPath = jpgPathFor(filePath);

  try {
    await fs.access(outputPath);
    return { filePath, outputPath, status: "skipped" };
  } catch {
    await sharp(filePath).rotate().jpeg({ quality: 88 }).toFile(outputPath);
    return { filePath, outputPath, status: "converted" };
  }
}

async function updatePhotoReferences(files) {
  let source = await fs.readFile(photosDataPath, "utf8");
  let replacements = 0;

  for (const filePath of files) {
    const oldName = path.basename(filePath);
    const newName = path.basename(jpgPathFor(filePath));
    const nextSource = source.replaceAll(`file: "${oldName}"`, `file: "${newName}"`);

    if (nextSource !== source) {
      replacements += 1;
      source = nextSource;
    }
  }

  if (replacements > 0) {
    await fs.writeFile(photosDataPath, source);
  }

  return replacements;
}

const heicFiles = await walk(photosRoot);
const results = [];

for (const filePath of heicFiles) {
  results.push(await convertFile(filePath));
}

const replacements = await updatePhotoReferences(heicFiles);
const converted = results.filter((result) => result.status === "converted").length;
const skipped = results.filter((result) => result.status === "skipped").length;

console.log(
  JSON.stringify(
    {
      heicFiles: heicFiles.length,
      converted,
      skipped,
      photoReferenceUpdates: replacements,
    },
    null,
    2
  )
);
