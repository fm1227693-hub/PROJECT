const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, 'public', 'favicon.png');
const svgPath = path.join(__dirname, 'public', 'favicon.svg');

if (!fs.existsSync(pngPath)) {
    console.error('favicon.png not found!');
    process.exit(1);
}

const base64Data = fs.readFileSync(pngPath, { encoding: 'base64' });
const dataUri = `data:image/png;base64,${base64Data}`;

const svgContent = `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="round">
      <rect x="0" y="0" width="256" height="256" rx="64" ry="64"/>
    </clipPath>
  </defs>
  <image href="${dataUri}" width="256" height="256" preserveAspectRatio="xMidYMid slice" clip-path="url(#round)"/>
</svg>`;

fs.writeFileSync(svgPath, svgContent);
console.log('favicon.svg generated successfully.');
