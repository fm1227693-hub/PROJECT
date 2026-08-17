const fs = require('fs');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  
  if (json.navbar && json.navbar.ieltsWriting) {
    json.navbar.ieltsWriting = 'IELTS Writing';
  }
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('Navbar ieltsWriting updated to "IELTS Writing".');
