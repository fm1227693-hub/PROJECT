const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ReadingTest') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/className="([^"]*prose dark:prose-invert max-w-none[^"]*)"/g, (match, p1) => {
    if(p1.includes('max-h-')) return match;
    return `className="${p1} max-h-[50vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden shadow-inner custom-scrollbar"`;
  });

  fs.writeFileSync(filePath, content);
});

console.log('Done replacing passages.');
