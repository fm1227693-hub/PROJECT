const fs = require('fs');
const path = require('path');

const uzPath = 'public/localization/uz/global.json';
const enPath = 'public/localization/en/global.json';
const ruPath = 'public/localization/ru/global.json';

const ieltsWritingAssessorNewData = {
  uz: {
    "task1": "Task 1",
    "task2": "Task 2",
    "minutes": "daqiqa",
    "start": "Boshlash",
    "academicWritingTest": "IELTS Academic Writing Test",
    "writingSimulator": "Writing Assessor & AI Simulator",
    "selectTopicSubtitle": "Mavzuni tanlang, yozing va AI bilan Band baholangizni bilib oling. Part 1 — 20 daqiqa, Part 2 — 40 daqiqa.",
    "backToTopics": "Mavzularga qaytish",
    "sampleGuide": "Band 8.5 / 9.0 Namuna Insho & Guide",
    "copyToEditor": "Editorga nusxalash",
    "overallBand": "Overall Band"
  },
  en: {
    "task1": "Task 1",
    "task2": "Task 2",
    "minutes": "minutes",
    "start": "Start",
    "academicWritingTest": "IELTS Academic Writing Test",
    "writingSimulator": "Writing Assessor & AI Simulator",
    "selectTopicSubtitle": "Choose a topic, write, and get your Band score from AI. Part 1 — 20 minutes, Part 2 — 40 minutes.",
    "backToTopics": "Back to Topics",
    "sampleGuide": "Band 8.5 / 9.0 Sample Essay & Guide",
    "copyToEditor": "Copy to Editor",
    "overallBand": "Overall Band"
  },
  ru: {
    "task1": "Task 1",
    "task2": "Task 2",
    "minutes": "минут",
    "start": "Начать",
    "academicWritingTest": "Тест IELTS Academic Writing",
    "writingSimulator": "Оценщик Writing и ИИ-Симулятор",
    "selectTopicSubtitle": "Выберите тему, напишите и узнайте свой балл от ИИ. Part 1 — 20 минут, Part 2 — 40 минут.",
    "backToTopics": "Вернуться к темами",
    "sampleGuide": "Band 8.5 / 9.0 Пример эссе и Руководство",
    "copyToEditor": "Копировать в редактор",
    "overallBand": "Общий балл (Overall Band)"
  }
};

[uzPath, enPath, ruPath].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(code);
  const lang = file.includes('uz') ? 'uz' : file.includes('en') ? 'en' : 'ru';
  
  if (!json.ieltsWritingAssessor) {
      json.ieltsWritingAssessor = {};
  }
  Object.assign(json.ieltsWritingAssessor, ieltsWritingAssessorNewData[lang]);
  
  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});

console.log('Writing Assessor translations added.');
