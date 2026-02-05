// 1) Make white/near-white background transparent  2) Trim transparent edges
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const inputPath = path.join(__dirname, '../public/assets/journey/character.png');
const WHITE_THRESHOLD = 248; // pixels with r,g,b >= this become transparent

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
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const trimmed = await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })
    .toBuffer();

  await fs.writeFile(inputPath, trimmed);
  console.log('White background made transparent and image trimmed. Saved:', inputPath);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
