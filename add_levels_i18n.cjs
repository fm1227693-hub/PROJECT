const fs = require('fs');

const levelsUz = {
  levels: {
    sectionBadge: "Kurs darajalari",
    sectionTitle: "O'z darajangizni tanlang",
    sectionDesc: "Har bir o'quvchi uchun individual yo'nalish — Beginner'dan Advanced'gacha.",
    cta: "Bepul sinov darsi olish",
    duration: "Davomiyligi",
    beginner: {
      label: "Beginner",
      desc: "Ingliz tilini noldan boshlaydiganlar uchun. Alifbo, oddiy so'zlar va asosiy grammatika.",
      f1: "Harflar va tovushlar",
      f2: "Kundalik iboralar",
      f3: "Asosiy grammatika"
    },
    elementary: {
      label: "Elementary",
      desc: "Bazaviy bilimlarni mustahkamlab, oddiy suhbat va matnlarni tushunishni o'rganasiz.",
      f1: "Present va Past tense",
      f2: "So'z boyligini kengaytirish",
      f3: "Oddiy matn yozish"
    },
    intermediate: {
      label: "Intermediate",
      desc: "IELTS 5.0-6.0 maqsadi. Murakkab grammatika, akademik lug'at va yozma nutq.",
      f1: "IELTS Writing Task 1 va 2",
      f2: "Academic vocabulary",
      f3: "Mock testlar"
    },
    upper: {
      label: "Upper-Intermediate",
      desc: "IELTS 6.5-7.0 darajasi. CDI simulyatsiyasi va keng lug'at bazasi bilan.",
      f1: "CDI Listening va Reading",
      f2: "Advanced Grammar",
      f3: "Natija tahlili"
    },
    advanced: {
      label: "Advanced",
      desc: "IELTS 7.5-8.5+ maqsad. Yuqori darajadagi barcha modullar va AI tahlil.",
      f1: "IELTS 8.5 strategiyasi",
      f2: "AI yozuv baholash",
      f3: "To'liq mock imtihon"
    }
  }
};

const levelsEn = {
  levels: {
    sectionBadge: "Course Levels",
    sectionTitle: "Choose Your Level",
    sectionDesc: "An individual path for every learner — from Beginner to Advanced.",
    cta: "Get a Free Trial Lesson",
    duration: "Duration",
    beginner: {
      label: "Beginner",
      desc: "For those starting English from scratch. Alphabet, basic words, and fundamental grammar.",
      f1: "Letters and Sounds",
      f2: "Everyday Phrases",
      f3: "Basic Grammar"
    },
    elementary: {
      label: "Elementary",
      desc: "Consolidate basic knowledge and learn to understand simple conversations and texts.",
      f1: "Present and Past Tense",
      f2: "Vocabulary Expansion",
      f3: "Simple Writing"
    },
    intermediate: {
      label: "Intermediate",
      desc: "IELTS 5.0-6.0 target. Complex grammar, academic vocabulary, and written English.",
      f1: "IELTS Writing Task 1 and 2",
      f2: "Academic Vocabulary",
      f3: "Mock Tests"
    },
    upper: {
      label: "Upper-Intermediate",
      desc: "IELTS 6.5-7.0 level. CDI simulation and extensive vocabulary base.",
      f1: "CDI Listening and Reading",
      f2: "Advanced Grammar",
      f3: "Results Analysis"
    },
    advanced: {
      label: "Advanced",
      desc: "IELTS 7.5-8.5+ target. All high-level modules with AI-powered analysis.",
      f1: "IELTS 8.5 Strategy",
      f2: "AI Writing Assessment",
      f3: "Full Mock Exams"
    }
  }
};

const levelsRu = {
  levels: {
    sectionBadge: "Уровни курса",
    sectionTitle: "Выберите свой уровень",
    sectionDesc: "Индивидуальный путь для каждого ученика — от Beginner до Advanced.",
    cta: "Записаться на пробный урок",
    duration: "Длительность",
    beginner: {
      label: "Beginner",
      desc: "Для тех, кто начинает английский с нуля. Алфавит, базовые слова и грамматика.",
      f1: "Буквы и звуки",
      f2: "Повседневные фразы",
      f3: "Базовая грамматика"
    },
    elementary: {
      label: "Elementary",
      desc: "Закрепление базовых знаний, понимание простых диалогов и текстов.",
      f1: "Present и Past Tense",
      f2: "Расширение словарного запаса",
      f3: "Простое письмо"
    },
    intermediate: {
      label: "Intermediate",
      desc: "Цель IELTS 5.0-6.0. Сложная грамматика, академическая лексика и письмо.",
      f1: "IELTS Writing Task 1 и 2",
      f2: "Academic Vocabulary",
      f3: "Mock тесты"
    },
    upper: {
      label: "Upper-Intermediate",
      desc: "Уровень IELTS 6.5-7.0. CDI симуляция и широкая база словарного запаса.",
      f1: "CDI Listening и Reading",
      f2: "Advanced Grammar",
      f3: "Анализ результатов"
    },
    advanced: {
      label: "Advanced",
      desc: "Цель IELTS 7.5-8.5+. Все высокоуровневые модули с AI-анализом.",
      f1: "Стратегия IELTS 8.5",
      f2: "AI оценка письма",
      f3: "Полные mock экзамены"
    }
  }
};

const items = [
  { path: 'public/localization/uz/global.json', data: levelsUz },
  { path: 'public/localization/en/global.json', data: levelsEn },
  { path: 'public/localization/ru/global.json', data: levelsRu }
];

items.forEach(({ path, data }) => {
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  Object.assign(json, data);
  fs.writeFileSync(path, JSON.stringify(json, null, 4), 'utf8');
  console.log('Updated:', path);
});
