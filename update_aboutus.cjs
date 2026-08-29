const fs = require('fs');

const path = 'c:/Users/user/Desktop/PROJECT/src/components/AboutUs.jsx';
let content = fs.readFileSync(path, 'utf8');

// Backgrounds
content = content.replace(/bg-black\/40/g, 'bg-white/40 dark:bg-black/40');
content = content.replace(/bg-black\/50/g, 'bg-white/60 dark:bg-black/50');

// Text colors
content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-gray-200/g, 'text-slate-700 dark:text-gray-200');
content = content.replace(/text-gray-300/g, 'text-slate-600 dark:text-gray-300');

// Shadows
content = content.replace(/shadow-\[0_20px_60px_rgba\(0,0,0,0\.6\)\]/g, 'shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]');
content = content.replace(/shadow-\[0_8px_32px_rgba\(0,0,0,0\.4\)\]/g, 'shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]');

fs.writeFileSync(path, content);
console.log('AboutUs.jsx updated for light mode!');
