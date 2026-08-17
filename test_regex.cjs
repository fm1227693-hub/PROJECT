const fs = require('fs');
const c = fs.readFileSync('src/components/ReadingTest3.jsx', 'utf-8');

const m1 = c.match(/\{\/\*\s*RIGHT SIDE - QUESTIONS\s*\*\/\}[\s\S]*?bg-slate-800\"[^>]*>\s*([\s\S]*?)\s*\{\/\*\s*SECTION 2/);
const m2 = c.match(/\{\/\*\s*SECTION 2\s*\*\/\}\s*([\s\S]*?)\s*\{\/\*\s*SECTION 3/);
const m3 = c.match(/\{\/\*\s*SECTION 3\s*\*\/\}\s*([\s\S]*?)(?:<\/div>\s*)*\{\/\*\s*ANSWERS TABLE/);

console.log('m1:', !!m1);
console.log('m2:', !!m2);
console.log('m3:', !!m3);
