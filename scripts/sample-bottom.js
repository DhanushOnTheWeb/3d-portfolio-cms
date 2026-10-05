const fs = require('fs');
const { PNG } = require('pngjs');

const buf = fs.readFileSync('public/avatars/male-1.png');
const png = new PNG();
png.parse(buf, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const { width, height } = data;
  console.log(`Dimensions: ${width}x${height}`);

  // Let's sample along the bottom 50 rows (where shoes & shadow are)
  const shadowSamples = [];
  for (let y = height - 40; y < height; y += 5) {
    for (let x = 0; x < width; x += 25) {
      const idx = (y * width + x) * 4;
      shadowSamples.push(`(${x},${y}): [${data.data[idx]}, ${data.data[idx+1]}, ${data.data[idx+2]}]`);
    }
  }
  console.log('Bottom samples:');
  console.log(shadowSamples.slice(0, 15).join('\n'));
});
