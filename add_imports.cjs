const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = ['ReadingTest1.jsx', 'ReadingTest2.jsx', 'ReadingTest3.jsx', 'ReadingTest4.jsx', 'ReadingTest5.jsx', 'ReadingTest6.jsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('import CdiReadingLayout')) {
    content = content.replace(
      /import React(.*?) from "react";/,
      `import React$1 from "react";\nimport CdiReadingLayout from "./CdiReadingLayout";`
    );
    fs.writeFileSync(filePath, content);
    console.log(`Added import to ${file}`);
  }
});
