const fs = require('fs');
const { PNG } = require('pngjs');

const buf = fs.readFileSync('public/avatars/male-1.png');
const png = new PNG();
png.parse(buf, (err, data) => {
  const { width, height } = data;
  const topSamples = [];
  for (let y = 10; y < 60; y += 10) {
    for (let x = 140; x < 210; x += 15) {
      const idx = (y * width + x) * 4;
      topSamples.push(`(${x},${y}): [${data.data[idx]}, ${data.data[idx+1]}, ${data.data[idx+2]}]`);
    }
  }
  console.log('Top hair samples:');
  console.log(topSamples.join('\n'));
});
