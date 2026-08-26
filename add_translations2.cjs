const fs = require('fs');
const path = require('path');

const locales = ['uz', 'ru', 'en'];
const baseDir = path.join(__dirname, 'public', 'localization');

const extraTranslations = {
  uz: {
    games: {
      title: "O'yinlar",
      wordScramble: {
        title: "Word Scramble",
        description: "Aralashib ketgan harflardan to'g'ri inglizcha so'zni tuzing.",
        correct: "To'g'ri topdingiz!",
        incorrect: "Xato, qaytadan urinib ko'ring.",
        scrambledLabel: "Aralash so'z:",
        placeholder: "Javobingizni yozing...",
        check: "Tekshirish",
        next: "Keyingisi"
      }
    },
    games1: {
      title: "Tic Tac Toe",
      subtitle: "Bo'sh vaqt uchun",
      winner: "G'olib:",
      draw: "Durang!",
      turn: "Navbat:",
      reset: "Qaytadan"
    },
    game2: {
      title: "Grammar Quiz",
      subtitle: "Grammatika bo'yicha testlar",
      level: "Daraja:",
      question: "Savol",
      of: "/",
      finishTitle: "Test yakunlandi!",
      resultText: "Siz {score} ball to'pladingiz",
      restart: "Qaytadan"
    },
    game3: {
      title: "Memory Game",
      subtitle: "So'zlarni yodda saqlash mashqi",
      streak: "Ketma-ketlik:",
      question: "Savol",
      of: "/",
      finishTitle: "O'yin yakunlandi!",
      resultText: "Siz {score} ball to'pladingiz",
      restart: "Qaytadan"
    }
  },
  ru: {
    games: {
      title: "Игры",
      wordScramble: {
        title: "Угадай слово",
        description: "Составьте правильное английское слово из перепутанных букв.",
        correct: "Правильно!",
        incorrect: "Неправильно, попробуйте еще раз.",
        scrambledLabel: "ПЕРЕМЕШАННОЕ СЛОВО:",
        placeholder: "Введите ваш ответ...",
        check: "Проверить",
        next: "Следующий"
      }
    },
    games1: {
      title: "Крестики-нолики",
      subtitle: "Для свободного времени",
      winner: "Победитель:",
      draw: "Ничья!",
      turn: "Очередь:",
      reset: "Заново"
    },
    game2: {
      title: "Грамматика",
      subtitle: "Тесты по грамматике",
      level: "Уровень:",
      question: "Вопрос",
      of: "из",
      finishTitle: "Тест завершен!",
      resultText: "Вы набрали {score} баллов",
      restart: "Заново"
    },
    game3: {
      title: "Игры на память",
      subtitle: "Упражнение на запоминание слов",
      streak: "Подряд:",
      question: "Вопрос",
      of: "из",
      finishTitle: "Игра завершена!",
      resultText: "Вы набрали {score} баллов",
      restart: "Заново"
    }
  },
  en: {
    games: {
      title: "Games",
      wordScramble: {
        title: "Word Scramble",
        description: "Make a correct English word from the scrambled letters.",
        correct: "Correct!",
        incorrect: "Incorrect, please try again.",
        scrambledLabel: "SCRAMBLED WORD:",
        placeholder: "Type your answer...",
        check: "Check",
        next: "Next"
      }
    },
    games1: {
      title: "Tic Tac Toe",
      subtitle: "For free time",
      winner: "Winner:",
      draw: "Draw!",
      turn: "Turn:",
      reset: "Restart"
    },
    game2: {
      title: "Grammar Quiz",
      subtitle: "Grammar tests",
      level: "Level:",
      question: "Question",
      of: "of",
      finishTitle: "Test Finished!",
      resultText: "You scored {score} points",
      restart: "Restart"
    },
    game3: {
      title: "Memory Game",
      subtitle: "Word memorization exercise",
      streak: "Streak:",
      question: "Question",
      of: "of",
      finishTitle: "Game Finished!",
      resultText: "You scored {score} points",
      restart: "Restart"
    }
  }
};

locales.forEach(lang => {
  const file = path.join(baseDir, lang, 'global.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    // Add old game translation blocks
    data.games = extraTranslations[lang].games;
    data.games1 = extraTranslations[lang].games1;
    data.game2 = extraTranslations[lang].game2;
    data.game3 = extraTranslations[lang].game3;
    
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
    console.log(`Updated ${lang}/global.json with old games translations`);
  }
});
