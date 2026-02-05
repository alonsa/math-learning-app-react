// Remove black bars from station image: make black pixels transparent, then trim
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const inputPath = path.join(__dirname, '../public/assets/journey/station.png');
const BLACK_THRESHOLD = 25; // pixels with r,g,b <= this become transparent

async function run() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const trimmed = await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })
    .toBuffer();

  await fs.writeFile(inputPath, trimmed);
  console.log('Black bars removed from station.png and trimmed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
