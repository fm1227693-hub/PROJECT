const fs = require('fs');
const path = require('path');

const locales = ['uz', 'ru', 'en'];
const baseDir = path.join(__dirname, 'public', 'localization');

const translations = {
  uz: {
    "gamesPage": {
      "badge": "O'yinlar",
      "title": "Ingliz tilini o'ynab o'rganamiz",
      "subtitle": "O'zingizga yoqqan o'yinni tanlang va bilimingizni sinab ko'ring",
      "backBtn": "Ortga qaytish",
      "games": {
        "wordScramble": {
          "title": "Word Scramble",
          "desc": "So'zlarni to'g'ri yig'ing",
          "gameTitle": "So'zni topish (Word Scramble)",
          "gameDesc": "Aralashib ketgan harflardan to'g'ri inglizcha so'zni tuzing.",
          "scrambledLabel": "Aralash so'z:",
          "placeholder": "Javobingizni yozing...",
          "correct": "To'g'ri topdingiz!",
          "incorrect": "Xato, qaytadan urinib ko'ring."
        },
        "vocabMatch": {
          "title": "Vocabulary Match",
          "desc": "So'zlarni va ma'nolarini moslang"
        },
        "grammarQuiz": {
          "title": "Grammar Quiz",
          "desc": "Grammatika bo'yicha testlar"
        },
        "memoryGame": {
          "title": "Memory Game",
          "desc": "So'zlarni yodda saqlash mashqi"
        },
        "sentenceBuilder": {
          "title": "Sentence Builder",
          "desc": "So'zlardan to'g'ri gap tuzing",
          "gameTitle": "Gap Tuzish",
          "gameDesc": "So'zlarni to'g'ri ketma-ketlikda joylashtirib mantiqiy gap tuzing.",
          "placeholder": "So'zlarni bu yerga yig'ing...",
          "errorAllWords": "Hamma so'zlarni ishlating!",
          "errorOrder": "Ketma-ketlik noto'g'ri, qaytadan urinib ko'ring.",
          "correct": "To'g'ri topdingiz!"
        },
        "missingLetters": {
          "title": "Missing Letters",
          "desc": "Tushib qolgan harflarni toping",
          "gameTitle": "Harflarni Topish",
          "gameDesc": "So'zdagi tushib qolgan harflarni topib, to'liq so'zni yozing.",
          "label": "Tushib qolgan harflar",
          "placeholder": "To'liq so'zni yozing...",
          "correct": "To'g'ri topdingiz!",
          "incorrect": "Xato, qaytadan urinib ko'ring."
        },
        "oddOneOut": {
          "title": "Odd One Out",
          "desc": "Ortiqchasini toping",
          "gameTitle": "Ortiqchasini Toping",
          "gameDesc": "Berilgan 4 ta so'zdan mantiqan guruhga kirmaydigan bittasini tanlang.",
          "correct": "To'g'ri! Ortiqcha so'z: ",
          "incorrect": "Xato. Ortiqcha so'z: "
        },
        "synonymFinder": {
          "title": "Synonym Finder",
          "desc": "So'zlarning ma'nodoshini toping",
          "gameTitle": "Sinonimni Toping",
          "gameDesc": "Berilgan so'zning ma'nodoshini (sinonimini) toping.",
          "label": "Shu so'zga sinonim toping:",
          "correct": "To'g'ri topdingiz!",
          "incorrect": "Xato. To'g'ri javob: "
        }
      },
      "common": {
        "score": "Ball:",
        "check": "Tekshirish",
        "next": "Keyingisi",
        "greatResult": "Ajoyib natija!",
        "totalScore": "Jami ball:",
        "playAgain": "Qaytadan o'ynash"
      }
    }
  },
  ru: {
    "gamesPage": {
      "badge": "Мини-игры",
      "title": "Изучаем английский играя",
      "subtitle": "Выберите понравившуюся игру и проверьте свои знания",
      "backBtn": "Вернуться назад",
      "games": {
        "wordScramble": {
          "title": "Word Scramble",
          "desc": "Соберите слова правильно",
          "gameTitle": "Угадай слово (Word Scramble)",
          "gameDesc": "Составьте правильное английское слово из перепутанных букв.",
          "scrambledLabel": "ПЕРЕМЕШАННОЕ СЛОВО:",
          "placeholder": "Введите ваш ответ...",
          "correct": "Правильно!",
          "incorrect": "Неправильно, попробуйте еще раз."
        },
        "vocabMatch": {
          "title": "Vocabulary Match",
          "desc": "Сопоставьте слова и их значения"
        },
        "grammarQuiz": {
          "title": "Grammar Quiz",
          "desc": "Тесты по грамматике"
        },
        "memoryGame": {
          "title": "Memory Game",
          "desc": "Упражнение на запоминание слов"
        },
        "sentenceBuilder": {
          "title": "Sentence Builder",
          "desc": "Составьте правильное предложение",
          "gameTitle": "Составление предложений",
          "gameDesc": "Расположите слова в правильном порядке, чтобы составить логичное предложение.",
          "placeholder": "Соберите слова здесь...",
          "errorAllWords": "Используйте все слова!",
          "errorOrder": "Неправильный порядок, попробуйте еще раз.",
          "correct": "Правильно!"
        },
        "missingLetters": {
          "title": "Missing Letters",
          "desc": "Найдите пропущенные буквы",
          "gameTitle": "Поиск букв",
          "gameDesc": "Найдите пропущенные буквы в слове и напишите полное слово.",
          "label": "Пропущенные буквы",
          "placeholder": "Напишите полное слово...",
          "correct": "Правильно!",
          "incorrect": "Неправильно, попробуйте еще раз."
        },
        "oddOneOut": {
          "title": "Odd One Out",
          "desc": "Найдите лишнее",
          "gameTitle": "Найдите лишнее",
          "gameDesc": "Выберите одно из 4 слов, которое не подходит к группе логически.",
          "correct": "Правильно! Лишнее слово: ",
          "incorrect": "Неправильно. Лишнее слово: "
        },
        "synonymFinder": {
          "title": "Synonym Finder",
          "desc": "Найдите синоним",
          "gameTitle": "Поиск синонимов",
          "gameDesc": "Найдите синоним к данному слову.",
          "label": "Найдите синоним к этому слову:",
          "correct": "Правильно!",
          "incorrect": "Неправильно. Правильный ответ: "
        }
      },
      "common": {
        "score": "Балл:",
        "check": "Проверить",
        "next": "Следующий",
        "greatResult": "Отличный результат!",
        "totalScore": "Общий балл:",
        "playAgain": "Играть снова"
      }
    }
  },
  en: {
    "gamesPage": {
      "badge": "Games",
      "title": "Learn English by Playing",
      "subtitle": "Choose a game you like and test your knowledge",
      "backBtn": "Go back",
      "games": {
        "wordScramble": {
          "title": "Word Scramble",
          "desc": "Assemble words correctly",
          "gameTitle": "Word Scramble",
          "gameDesc": "Make a correct English word from the scrambled letters.",
          "scrambledLabel": "SCRAMBLED WORD:",
          "placeholder": "Type your answer...",
          "correct": "Correct!",
          "incorrect": "Incorrect, please try again."
        },
        "vocabMatch": {
          "title": "Vocabulary Match",
          "desc": "Match words with their meanings"
        },
        "grammarQuiz": {
          "title": "Grammar Quiz",
          "desc": "Grammar tests"
        },
        "memoryGame": {
          "title": "Memory Game",
          "desc": "Word memorization exercise"
        },
        "sentenceBuilder": {
          "title": "Sentence Builder",
          "desc": "Form a correct sentence",
          "gameTitle": "Sentence Builder",
          "gameDesc": "Arrange the words in the correct order to form a logical sentence.",
          "placeholder": "Gather words here...",
          "errorAllWords": "Use all words!",
          "errorOrder": "Incorrect order, please try again.",
          "correct": "Correct!"
        },
        "missingLetters": {
          "title": "Missing Letters",
          "desc": "Find the missing letters",
          "gameTitle": "Missing Letters",
          "gameDesc": "Find the missing letters in the word and type the full word.",
          "label": "Missing letters",
          "placeholder": "Type the full word...",
          "correct": "Correct!",
          "incorrect": "Incorrect, please try again."
        },
        "oddOneOut": {
          "title": "Odd One Out",
          "desc": "Find the odd one",
          "gameTitle": "Odd One Out",
          "gameDesc": "Choose the one word out of 4 that doesn't logically belong to the group.",
          "correct": "Correct! The odd word is: ",
          "incorrect": "Incorrect. The odd word is: "
        },
        "synonymFinder": {
          "title": "Synonym Finder",
          "desc": "Find a synonym",
          "gameTitle": "Synonym Finder",
          "gameDesc": "Find a synonym for the given word.",
          "label": "Find a synonym for this word:",
          "correct": "Correct!",
          "incorrect": "Incorrect. The correct answer is: "
        }
      },
      "common": {
        "score": "Score:",
        "check": "Check",
        "next": "Next",
        "greatResult": "Great result!",
        "totalScore": "Total score:",
        "playAgain": "Play again"
      }
    }
  }
};

locales.forEach(lang => {
  const file = path.join(baseDir, lang, 'global.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.gamesPage = translations[lang].gamesPage;
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
    console.log(`Updated ${lang}/global.json`);
  }
});
