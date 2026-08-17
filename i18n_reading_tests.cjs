const fs = require('fs');
const path = require('path');

const locales = {
  uz: {
    clearAll: "Tozalash",
    submitTest: "Tekshirish",
    submitted: "Tekshirildi",
    score: "Natija",
    showAnswers: "To'g'ri javoblarni ko'rish",
    hideAnswers: "Javoblarni yashirish",
    question: "Savol",
    correctAnswers: "To'g'ri javob(lar)"
  },
  en: {
    clearAll: "Clear All",
    submitTest: "Submit Test",
    submitted: "Submitted",
    score: "Score",
    showAnswers: "View Answers",
    hideAnswers: "Hide Answers",
    question: "Question",
    correctAnswers: "Correct Answer(s)"
  },
  ru: {
    clearAll: "Очистить все",
    submitTest: "Проверить тест",
    submitted: "Проверено",
    score: "Результат",
    showAnswers: "Показать ответы",
    hideAnswers: "Скрыть ответы",
    question: "Вопрос",
    correctAnswers: "Правильный ответ(ы)"
  }
};

['uz', 'en', 'ru'].forEach(lang => {
  const filePath = path.join('public', 'localization', lang, 'global.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.readingTest = locales[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
  }
});

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ReadingTest') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('useTranslation')) {
    // Inject import
    content = content.replace(
      /import \{ motion \} from "framer-motion";/,
      `import { motion } from "framer-motion";\nimport { useTranslation } from "react-i18next";`
    );

    // Inject hook
    content = content.replace(
      /(?:export default function ReadingTest\d\(\) \{|const ReadingTest\d = \(\) => \{)/,
      `$&\n  const { t } = useTranslation();`
    );

    // Replace strings
    content = content.replace(/>\s*Clear All\s*<\/button>/, `>{t("readingTest.clearAll")}</button>`);
    content = content.replace(/>\s*\{submitted \? "Submitted" : "Submit Test"\}\s*<\/button>/, `>{submitted ? t("readingTest.submitted") : t("readingTest.submitTest")}</button>`);
    content = content.replace(/>\s*Score: \{score\}/, `>{t("readingTest.score")}: {score}`);
    content = content.replace(/"Javoblarni yashirish" : "To'g'ri javoblarni ko'rish"/g, `t("readingTest.hideAnswers") : t("readingTest.showAnswers")`);
    content = content.replace(/>Savol<\/th>/, `>{t("readingTest.question")}</th>`);
    content = content.replace(/>To'g'ri javob\(lar\)<\/th>/, `>{t("readingTest.correctAnswers")}</th>`);

    fs.writeFileSync(filePath, content);
  }
});
console.log('I18n updated.');
