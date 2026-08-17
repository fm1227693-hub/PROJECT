const fs = require('fs');
const path = require('path');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const updates = {
  uz: {
    "yes": "Ha",
    "no": "Yo'q"
  },
  en: {
    "yes": "Yes",
    "no": "No"
  },
  ru: {
    "yes": "Да",
    "no": "Нет"
  }
};

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  const lang = file.includes('uz') ? 'uz' : file.includes('en') ? 'en' : 'ru';
  
  if (json.readingTest) {
    Object.assign(json.readingTest, updates[lang]);
  }
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('Yes/no translations added.');
