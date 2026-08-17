const fs = require('fs');
const path = require('path');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const newTranslations = {
  uz: {
    "part1Title": "Part 1 — Task 1 (Academic)",
    "part2Title": "Part 2 — Task 2 (Essay)",
    "part1Desc": "20 daqiqa | Kamida 150 so'z | Grafik, jadval, xarita tavsifi",
    "part2Desc": "40 daqiqa | Kamida 250 so'z | Argument insho"
  },
  en: {
    "part1Title": "Part 1 — Task 1 (Academic)",
    "part2Title": "Part 2 — Task 2 (Essay)",
    "part1Desc": "20 minutes | At least 150 words | Graph, table, map description",
    "part2Desc": "40 minutes | At least 250 words | Argumentative essay"
  },
  ru: {
    "part1Title": "Part 1 — Task 1 (Academic)",
    "part2Title": "Part 2 — Task 2 (Essay)",
    "part1Desc": "20 минут | Минимум 150 слов | Описание графика, таблицы, карты",
    "part2Desc": "40 минут | Минимум 250 слов | Эссе-аргументация"
  }
};

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  const lang = file.includes('uz') ? 'uz' : file.includes('en') ? 'en' : 'ru';
  
  if (!json.ieltsWritingAssessor) {
      json.ieltsWritingAssessor = {};
  }
  Object.assign(json.ieltsWritingAssessor, newTranslations[lang]);
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('Writing Assessor part 1/2 translations added.');
