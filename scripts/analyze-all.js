const fs = require('fs');
const { PNG } = require('pngjs');

const files = [
  'male-1.png', 'male-2.png', 'male-3.png', 'male-4.png',
  'female-1.png', 'female-2.png', 'female-3.png', 'female-4.png'
];

files.forEach(file => {
  const path = `public/avatars/${file}`;
  if (!fs.existsSync(path)) return;
  const buffer = fs.readFileSync(path);
  const png = PNG.sync.read(buffer);
  const tl = [png.data[0], png.data[1], png.data[2]];
  const tr = [png.data[(png.width - 1) * 4], png.data[(png.width - 1) * 4 + 1], png.data[(png.width - 1) * 4 + 2]];
  const bl = [png.data[(png.height - 1) * png.width * 4], png.data[(png.height - 1) * png.width * 4 + 1], png.data[(png.height - 1) * png.width * 4 + 2]];
  const br = [png.data[((png.height - 1) * png.width + png.width - 1) * 4], png.data[((png.height - 1) * png.width + png.width - 1) * 4 + 1], png.data[((png.height - 1) * png.width + png.width - 1) * 4 + 2]];
  console.log(`${file}: ${png.width}x${png.height} | TL=${tl.join(',')} TR=${tr.join(',')} BL=${bl.join(',')} BR=${br.join(',')}`);
});
