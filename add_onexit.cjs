const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = ['ReadingTest1.jsx', 'ReadingTest2.jsx', 'ReadingTest3.jsx', 'ReadingTest4.jsx', 'ReadingTest5.jsx', 'ReadingTest6.jsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Change function signature
  content = content.replace(/export default function (ReadingTest\d)\(\) \{/, 'export default function $1({ onExit }) {');
  
  // Pass onExit to CdiReadingLayout
  content = content.replace(/<CdiReadingLayout/, '<CdiReadingLayout\n      onExit={onExit}');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} to accept onExit`);
});
