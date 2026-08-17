const fs = require('fs');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const listeningData = {
  uz: {
    "listeningHub": {
      "test1": "Amaliy Test 1",
      "test2": "Amaliy Test 2",
      "test3": "Amaliy Test 3",
      "test4": "Amaliy Test 4",
      "test5": "Amaliy Test 5",
      "test6": "Amaliy Test 6"
    },
    "listeningTest": {
      "checkAnswers": "Javoblarni Tekshirish",
      "retakeTest": "Qayta Topshirish",
      "score": "Sizning Natijangiz:"
    }
  },
  en: {
    "listeningHub": {
      "test1": "Practice Test 1",
      "test2": "Practice Test 2",
      "test3": "Practice Test 3",
      "test4": "Practice Test 4",
      "test5": "Practice Test 5",
      "test6": "Practice Test 6"
    },
    "listeningTest": {
      "checkAnswers": "Check Answers",
      "retakeTest": "Retake Test",
      "score": "Your Score:"
    }
  },
  ru: {
    "listeningHub": {
      "test1": "Практический Тест 1",
      "test2": "Практический Тест 2",
      "test3": "Практический Тест 3",
      "test4": "Практический Тест 4",
      "test5": "Практический Тест 5",
      "test6": "Практический Тест 6"
    },
    "listeningTest": {
      "checkAnswers": "Проверить Ответы",
      "retakeTest": "Пройти Снова",
      "score": "Ваш Результат:"
    }
  }
};

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  const lang = file.includes('uz') ? 'uz' : file.includes('en') ? 'en' : 'ru';
  
  Object.assign(json, listeningData[lang]);
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('Listening translations added.');
