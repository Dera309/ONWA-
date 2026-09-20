const fs = require('fs');
const path = require('path');

// 1. Remove metadata route icons from src/app so Next.js doesn't try to build dynamic image routes for them
const filesToRemove = [
  path.join(__dirname, '..', 'src', 'app', 'favicon.ico'),
  path.join(__dirname, '..', 'src', 'app', 'icon.png'),
  path.join(__dirname, '..', 'src', 'app', 'icon.ico'),
  path.join(__dirname, '..', 'src', 'app', 'icon.svg'),
];

for (const file of filesToRemove) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('Removed:', file);
  }
}

// 2. Create clean static SVG icon in public/
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="30" fill="#0B0F17" stroke="#C5A880" stroke-width="2"/>
  <path d="M32 10 A22 22 0 1 0 54 32 A22 24 0 0 1 32 10 Z" fill="#D4AF37"/>
  <circle cx="32" cy="32" r="8" fill="#0B0F17"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon.svg'), svgContent, 'utf8');

// 3. Create a clean 16x16 standard ICO file in public/
const width = 16;
const height = 16;
const bpp = 32;
const numBytes = 6 + 16 + 40 + (width * height * 4) + (width * height / 8);
const ico = Buffer.alloc(numBytes);

// ICONDIR
ico.writeUInt16LE(0, 0); // reserved
ico.writeUInt16LE(1, 2); // type 1 = ICO
ico.writeUInt16LE(1, 4); // count = 1

// ICONDIRENTRY
ico.writeUInt8(width, 6);
ico.writeUInt8(height, 7);
ico.writeUInt8(0, 8); // color count
ico.writeUInt8(0, 9); // reserved
ico.writeUInt16LE(1, 10); // planes
ico.writeUInt16LE(32, 12); // bit count
ico.writeUInt32LE(40 + (width * height * 4) + (width * height / 8), 14); // bytes in res
ico.writeUInt32LE(22, 18); // offset

// BITMAPINFOHEADER
let offset = 22;
ico.writeUInt32LE(40, offset); // header size
ico.writeInt32LE(width, offset + 4);
ico.writeInt32LE(height * 2, offset + 8); // height * 2 for mask
ico.writeUInt16LE(1, offset + 12); // planes
ico.writeUInt16LE(32, offset + 14); // bit count
ico.writeUInt32LE(0, offset + 16); // compression BI_RGB
ico.writeUInt32LE(width * height * 4, offset + 20); // image size
ico.writeInt32LE(0, offset + 24);
ico.writeInt32LE(0, offset + 28);
ico.writeUInt32LE(0, offset + 32);
ico.writeUInt32LE(0, offset + 36);

offset += 40;

// Pixel data (BGRA, bottom-to-top)
const goldB = 0x37, goldG = 0xAF, goldR = 0xD4;
const darkB = 0x17, darkG = 0x0F, darkR = 0x0B;

for (let y = height - 1; y >= 0; y--) {
  for (let x = 0; x < width; x++) {
    const dx = x - 7.5;
    const dy = y - 7.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist <= 7.0) {
      const dx2 = x - 9.0;
      const dy2 = y - 7.5;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (dist2 <= 5.0) {
        ico.writeUInt8(darkB, offset);
        ico.writeUInt8(darkG, offset + 1);
        ico.writeUInt8(darkR, offset + 2);
        ico.writeUInt8(255, offset + 3);
      } else {
        ico.writeUInt8(goldB, offset);
        ico.writeUInt8(goldG, offset + 1);
        ico.writeUInt8(goldR, offset + 2);
        ico.writeUInt8(255, offset + 3);
      }
    } else {
      ico.writeUInt8(0, offset);
      ico.writeUInt8(0, offset + 1);
      ico.writeUInt8(0, offset + 2);
      ico.writeUInt8(0, offset + 3);
    }
    offset += 4;
  }
}

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), ico);

// 4. Create a clean 32x32 PNG in public/icon.png
const cleanPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAd0lEQVRYhe2WsQ2AMAwE340sQGf/mQ6UKRBCiEihwAn3/0r254tz5pzb58NlA7h9eEa7dDvgA2wB51zZ/wTYAvq131b7rZ8Bq8Vea//GngE7wFvrH/jO3wE1YI1/r/0r8AKG1b5vBvSBV2vfZgN0v3d8nK31AXQhKxGfB87xAAAAAElFTkSuQmCC',
  'base64'
);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon.png'), cleanPng);

console.log('✅ Clean static icons created in public/ and dynamic metadata icons removed from src/app/');
