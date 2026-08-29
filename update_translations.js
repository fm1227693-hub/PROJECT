const fs = require('fs');
const path = require('path');

const locales = {
  uz: {
    premiumLoader: {
      text: "KIRISH",
      cap1: "Ma'lumotlar tekshirilmoqda",
      cap2: "Kirish tasdiqlanmoqda",
      cap3: "Deyarli tayyor",
      cap4: "Xush kelibsiz"
    },
    themeLoader: {
      text: "REJIM",
      cap1: "Rejim o'zgartirilmoqda",
      cap2: "Ranglar moslashtirilmoqda",
      cap3: "Deyarli tayyor",
      cap4: "Tayyor"
    }
  },
  ru: {
    premiumLoader: {
      text: "ВХОД",
      cap1: "Проверка данных",
      cap2: "Подтверждение входа",
      cap3: "Почти готово",
      cap4: "Добро пожаловать"
    },
    themeLoader: {
      text: "РЕЖИМ",
      cap1: "Смена режима",
      cap2: "Адаптация цветов",
      cap3: "Почти готово",
      cap4: "Готово"
    }
  },
  en: {
    premiumLoader: {
      text: "ENTER",
      cap1: "Verifying data",
      cap2: "Confirming access",
      cap3: "Almost ready",
      cap4: "Welcome"
    },
    themeLoader: {
      text: "THEME",
      cap1: "Changing theme",
      cap2: "Adapting colors",
      cap3: "Almost ready",
      cap4: "Ready"
    }
  }
};

['uz', 'ru', 'en'].forEach(lang => {
  const filePaths = [
    path.join('c:/Users/user/Desktop/PROJECT/public/localization', lang, 'global.json'),
    path.join('c:/Users/user/Desktop/PROJECT/dist/localization', lang, 'global.json')
  ];
  
  filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.premiumLoader = locales[lang].premiumLoader;
        data.themeLoader = { ...data.themeLoader, ...locales[lang].themeLoader };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Updated ${filePath}`);
      }
  });
});
