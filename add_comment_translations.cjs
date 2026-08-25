const fs = require('fs');

const translations = {
  uz: {
    viewAllBtn: "Barcha izohlarni ko'rish",
    closeBtn: "Yopish"
  },
  en: {
    viewAllBtn: "View all comments",
    closeBtn: "Close"
  },
  ru: {
    viewAllBtn: "Посмотреть все комментарии",
    closeBtn: "Закрыть"
  }
};

['uz', 'en', 'ru'].forEach(lang => {
  const path = `./public/localization/${lang}/global.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    
    if (data.studentCommentsORG) {
        Object.assign(data.studentCommentsORG, translations[lang]);
    } else {
        data.studentCommentsORG = translations[lang];
    }
    
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
    console.log(`Updated ${lang}`);
  }
});
