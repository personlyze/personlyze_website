import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Folders to search through
const targetDirectories = ['./public', './src'];

function convertFolder(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Look inside subfolders recursively
      convertFolder(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      
      // Convert PNGs and JPGs to WebP
      if (['.webp', '.webp', '.jpeg'].includes(ext)) {
        const outputPath = path.join(
          path.dirname(fullPath),
          `${path.parse(file).name}.webp`
        );

        sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(outputPath)
          .then(() => console.log(`Converted: ${fullPath} -> ${path.parse(file).name}.webp`))
          .catch((err) => console.error(`Error with ${fullPath}:`, err));
      }
    }
  });
}

// Start conversion
targetDirectories.forEach((dir) => convertFolder(dir));