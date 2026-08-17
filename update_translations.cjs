const fs = require('fs');
const path = require('path');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const updates = {
  uz: {
    "highlight": "Ajratish (Highlight)",
    "notes": "Qaydlar (Notes)",
    "clear": "O'chirish (Clear)",
    "note": "Qayd",
    "typeNote": "Qaydlaringizni shu yerga yozing...",
    "save": "Saqlash",
    "testPaused": "Test To'xtatildi",
    "resume": "Davom etish",
    "confirmRestart": "Boshidan boshlaysizmi?",
    "confirmExit": "Testdan chiqmoqchimisiz? Natijalar saqlanmaydi."
  },
  en: {
    "highlight": "Highlight",
    "notes": "Notes",
    "clear": "Clear",
    "note": "Note",
    "typeNote": "Type your notes here...",
    "save": "Save",
    "testPaused": "Test Paused",
    "resume": "Resume",
    "confirmRestart": "Are you sure you want to restart?",
    "confirmExit": "Are you sure you want to exit? Results will not be saved."
  },
  ru: {
    "highlight": "Выделить (Highlight)",
    "notes": "Заметки (Notes)",
    "clear": "Очистить (Clear)",
    "note": "Заметка",
    "typeNote": "Введите ваши заметки здесь...",
    "save": "Сохранить",
    "testPaused": "Тест приостановлен",
    "resume": "Продолжить",
    "confirmRestart": "Начать сначала?",
    "confirmExit": "Выйти из теста? Результаты не будут сохранены."
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

console.log('Translations updated.');
