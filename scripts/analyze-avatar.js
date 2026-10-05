const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/avatars/male-1.png')
  .pipe(new PNG())
  .on('parsed', function () {
    console.log(`Image dimensions: ${this.width} x ${this.height}`);
    // Check top-left, top-right, bottom-left, bottom-right colors
    const corners = [
      { name: 'top-left', idx: 0 },
      { name: 'top-right', idx: (this.width - 1) * 4 },
      { name: 'top-center', idx: Math.floor(this.width / 2) * 4 },
      { name: 'bottom-left', idx: (this.height - 1) * this.width * 4 },
      { name: 'bottom-right', idx: ((this.height - 1) * this.width + (this.width - 1)) * 4 },
    ];
    for (const c of corners) {
      console.log(`${c.name}: R=${this.data[c.idx]}, G=${this.data[c.idx+1]}, B=${this.data[c.idx+2]}, A=${this.data[c.idx+3]}`);
    }
  });
