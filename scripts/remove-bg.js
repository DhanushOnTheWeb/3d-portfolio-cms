const fs = require('fs');
const { PNG } = require('pngjs');

function processImage(inputPath, outputPath) {
  const buf = fs.readFileSync(inputPath);
  const png = new PNG();
  
  png.parse(buf, (err, data) => {
    if (err) {
      console.error('Error parsing:', err);
      return;
    }
    const { width, height } = data;
    const isBg = new Uint8Array(width * height);

    function isBackgroundCandidate(x, y) {
      const idx = (y * width + x) * 4;
      const r = data.data[idx];
      const g = data.data[idx + 1];
      const b = data.data[idx + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      const lightness = (r + g + b) / 3;

      // Background is light neutral
      if (lightness > 170 && sat < 38) {
        return true;
      }
      // Floor shadow under feet / between shoes
      if (y > height * 0.75 && lightness > 125 && sat < 25) {
        return true;
      }
      if (lightness > 205 && sat < 40) {
        return true;
      }

      return false;
    }

    // BFS queue
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
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
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

    // Clean up small foreground noise / specks (< 100 connected pixels)
    const visited = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIdx = y * width + x;
        if (isBg[pIdx] === 0 && visited[pIdx] === 0) {
          // BFS connected component
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
          if (comp.length < 80) {
            // It's a tiny detached speck/shadow artifact, mark as background!
            for (const [cx, cy] of comp) {
              isBg[cy * width + cx] = 1;
            }
          }
        }
      }
    }

    // Apply alpha with gentle edge anti-aliasing
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIdx = y * width + x;
        const idx = pIdx * 4;

        if (isBg[pIdx] === 1) {
          // Near edge check
          let fgNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (isBg[ny * width + nx] === 0) {
                  fgNeighbors++;
                }
              }
            }
          }

          if (fgNeighbors > 0) {
            data.data[idx + 3] = Math.min(255, fgNeighbors * 25);
          } else {
            data.data[idx + 3] = 0;
          }
        } else {
          // Check border to remove any fringe
          let bgNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (isBg[ny * width + nx] === 1) {
                  bgNeighbors++;
                }
              }
            }
          }
          if (bgNeighbors >= 4) {
            data.data[idx + 3] = 200;
          }
        }
      }
    }

    const outBuf = PNG.sync.write(data);
    fs.writeFileSync(outputPath, outBuf);
    console.log(`Successfully processed: ${outputPath}`);
  });
}

processImage('public/avatars/male-1-orig.png', 'public/avatars/male-1.png');
