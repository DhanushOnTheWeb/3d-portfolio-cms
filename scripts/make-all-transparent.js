const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

const files = [
  'male-1.png', 'male-2.png', 'male-3.png', 'male-4.png',
  'female-1.png', 'female-2.png', 'female-3.png', 'female-4.png'
];

function decodeImage(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    const decoded = jpeg.decode(buf, { useTArray: true });
    return { width: decoded.width, height: decoded.height, data: decoded.data };
  } else if (buf[0] === 0x89 && buf[1] === 0x50) {
    const png = PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  }
  throw new Error('Unknown format for ' + filePath);
}

function processAvatar(fileName) {
  const filePath = path.join('public', 'avatars', fileName);
  if (!fs.existsSync(filePath)) return;

  let inputPath = filePath;
  if (fileName === 'male-1.png' && fs.existsSync('public/avatars/male-1-orig.png')) {
    inputPath = 'public/avatars/male-1-orig.png';
  }

  const { width, height, data } = decodeImage(inputPath);
  console.log(`Processing ${fileName}: ${width}x${height}`);

  const isBg = new Uint8Array(width * height);

  function isBackgroundCandidate(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lightness = (r + g + b) / 3;

    // Light neutral background
    if (lightness > 170 && sat < 38) return true;
    if (lightness > 205 && sat < 45) return true;
    // Floor shadow under feet
    if (y > height * 0.70 && lightness > 120 && sat < 28) return true;
    // Bottom 5% edge artifacts
    if (y > height * 0.95 && lightness > 90 && sat < 30) return true;

    return false;
  }

  // BFS from all borders
  const queue = [];
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    isBg[0 * width + x] = 1;
    isBg[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    isBg[y * width + 0] = 1;
    isBg[y * width + (width - 1)] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (isBg[nIdx] === 0 && isBackgroundCandidate(nx, ny)) {
          isBg[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Find all foreground connected components
  const visited = new Uint8Array(width * height);
  const components = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      if (isBg[pIdx] === 0 && visited[pIdx] === 0) {
        const comp = [[x, y]];
        visited[pIdx] = 1;
        let cHead = 0;
        while (cHead < comp.length) {
          const [cx, cy] = comp[cHead++];
          const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (isBg[nIdx] === 0 && visited[nIdx] === 0) {
                visited[nIdx] = 1;
                comp.push([nx, ny]);
              }
            }
          }
        }
        components.push(comp);
      }
    }
  }

  // Sort components by size descending
  components.sort((a, b) => b.length - a.length);

  // The largest component is the main body
  // Keep only components that have significant size (e.g. > 1500 pixels for smaller images or > 0.5% of pixels)
  const minKeepSize = Math.max(150, Math.floor(width * height * 0.003));
  for (let i = 1; i < components.length; i++) {
    if (components[i].length < minKeepSize) {
      // Remove tiny artifacts / ground lines
      for (const [cx, cy] of components[i]) {
        isBg[cy * width + cx] = 1;
      }
    }
  }

  // Create clean transparent PNG
  const outPng = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const srcIdx = pIdx * 4;
      const dstIdx = srcIdx;

      outPng.data[dstIdx] = data[srcIdx];
      outPng.data[dstIdx + 1] = data[srcIdx + 1];
      outPng.data[dstIdx + 2] = data[srcIdx + 2];

      if (isBg[pIdx] === 1) {
        let fgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx] === 0) fgNeighbors++;
            }
          }
        }
        outPng.data[dstIdx + 3] = fgNeighbors > 0 ? Math.min(255, fgNeighbors * 25) : 0;
      } else {
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx] === 1) bgNeighbors++;
            }
          }
        }
        outPng.data[dstIdx + 3] = bgNeighbors >= 4 ? 200 : 255;
      }
    }
  }

  const outBuf = PNG.sync.write(outPng);
  fs.writeFileSync(filePath, outBuf);
  console.log(`Saved transparent PNG: ${filePath}`);
}

files.forEach(processAvatar);
