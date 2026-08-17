const fs = require('fs');
const path = require('path');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const readingHubData = {
  uz: {
    "title1": "IELTS",
    "title2": "Reading",
    "subtitle": "Haqiqiy Kompyuterda topshiriladigan IELTS (CDI) formatini sinab ko'ring. 60 daqiqalik sessiyani boshlash uchun quyidagi amaliy testlardan birini tanlang.",
    "startTest": "Testni Boshlash",
    "duration": "60 Daq",
    "test1Title": "Amaliy Test 1",
    "test1Desc": "General Training va Academic aralash",
    "test2Title": "Amaliy Test 2",
    "test2Desc": "Ilm-fan va Tarixga yo'naltirilgan",
    "test3Title": "Amaliy Test 3",
    "test3Desc": "Tabiat va Texnologiya",
    "test4Title": "Amaliy Test 4",
    "test4Desc": "San'at va Madaniyat",
    "test5Title": "Amaliy Test 5",
    "test5Desc": "Ilg'or Akademik Reading",
    "test6Title": "Amaliy Test 6",
    "test6Desc": "Kompleks Imtihon"
  },
  en: {
    "title1": "IELTS",
    "title2": "Reading",
    "subtitle": "Experience the real Computer-Delivered IELTS format. Choose a practice test below to start your 60-minute session.",
    "startTest": "Start Test",
    "duration": "60 Min",
    "test1Title": "Practice Test 1",
    "test1Desc": "General Training & Academic mix",
    "test2Title": "Practice Test 2",
    "test2Desc": "Science and History focus",
    "test3Title": "Practice Test 3",
    "test3Desc": "Nature and Technology",
    "test4Title": "Practice Test 4",
    "test4Desc": "Arts and Culture",
    "test5Title": "Practice Test 5",
    "test5Desc": "Advanced Academic Reading",
    "test6Title": "Practice Test 6",
    "test6Desc": "Comprehensive Exam"
  },
  ru: {
    "title1": "IELTS",
    "title2": "Reading",
    "subtitle": "Испытайте настоящий формат IELTS на компьютере. Выберите практический тест ниже, чтобы начать 60-минутную сессию.",
    "startTest": "Начать Тест",
    "duration": "60 Мин",
    "test1Title": "Практический Тест 1",
    "test1Desc": "Смесь General Training и Academic",
    "test2Title": "Практический Тест 2",
    "test2Desc": "Фокус на науке и истории",
    "test3Title": "Практический Тест 3",
    "test3Desc": "Природа и технологии",
    "test4Title": "Практический Тест 4",
    "test4Desc": "Искусство и культура",
    "test5Title": "Практический Тест 5",
    "test5Desc": "Продвинутое Академическое Чтение",
    "test6Title": "Практический Тест 6",
    "test6Desc": "Комплексный экзамен"
  }
};

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  const lang = file.includes('uz') ? 'uz' : file.includes('en') ? 'en' : 'ru';
  
  if (!json.readingHub) {
      json.readingHub = {};
  }
  Object.assign(json.readingHub, readingHubData[lang]);
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('ReadingHub translations added.');
