export const COURSES = [
  {
    id: 'beginner',
    levelKey: 'beginner',
    titleKey: 'levels.beginner.label',
    descKey: 'levels.beginner.desc',
    cefr: 'A1 – A2',
    targetIelts: '3.5 – 4.5',
    duration: '3–4 oy / months',
    monthlyPrice: '500 000',
    planId: 'basic',
    badge: 'Foundation',
    accentColor: '#10b981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    features: [
      'levels.beginner.f1',
      'levels.beginner.f2',
      'levels.beginner.f3',
    ],
    detailedHighlights: [
      'Noldan boshlab to\'g\'ri talaffuz va fonetika',
      'Kundalik oddiy iboralar va muloqot asosi',
      'Boshlang\'ich grammatika va so\'z boyligi'
    ],
    recommendedFor: 'Ingliz tilini noldan o\'rganmoqchi bo\'lganlar uchun'
  },
  {
    id: 'elementary',
    levelKey: 'elementary',
    titleKey: 'levels.elementary.label',
    descKey: 'levels.elementary.desc',
    cefr: 'A2 – B1',
    targetIelts: '4.5 – 5.5',
    duration: '3–4 oy / months',
    monthlyPrice: '500 000',
    planId: 'basic',
    badge: 'Fluency Step',
    accentColor: '#0ea5e9',
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    features: [
      'levels.elementary.f1',
      'levels.elementary.f2',
      'levels.elementary.f3',
    ],
    detailedHighlights: [
      'Present, Past va Future zamonlarida erkin fikrlash',
      'Matnlarni tez tushunish va kundalik dialoglar',
      'Til to\'sig\'ini (fear of speaking) yengish'
    ],
    recommendedFor: 'Boshlang\'ich bazaga ega bo\'lib, so\'zlashishni xohlovchilar uchun'
  },
  {
    id: 'intermediate',
    levelKey: 'intermediate',
    titleKey: 'levels.intermediate.label',
    descKey: 'levels.intermediate.desc',
    cefr: 'B1 – B2',
    targetIelts: '5.5 – 6.5',
    duration: '4–5 oy / months',
    monthlyPrice: '600 000',
    planId: 'standard',
    badge: 'Pre-IELTS',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    features: [
      'levels.intermediate.f1',
      'levels.intermediate.f2',
      'levels.intermediate.f3',
    ],
    detailedHighlights: [
      'IELTS Writing Task 1 va Task 2 strukturasi',
      'Akademik lug\'at va murakkab grammatik konstruksiyalar',
      'Haftalik Reading & Listening mock testlari'
    ],
    recommendedFor: 'IELTS imtihoniga jiddiy tayyorgarlikni boshlovchilar uchun'
  },
  {
    id: 'upper-intermediate',
    levelKey: 'upper',
    titleKey: 'levels.upper.label',
    descKey: 'levels.upper.desc',
    cefr: 'B2 – C1',
    targetIelts: '6.5 – 7.5',
    duration: '4–5 oy / months',
    monthlyPrice: '600 000',
    planId: 'standard',
    badge: 'IELTS Intensive',
    accentColor: '#f59e0b',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    isPopular: true,
    features: [
      'levels.upper.f1',
      'levels.upper.f2',
      'levels.upper.f3',
    ],
    detailedHighlights: [
      'Kompyuterda topshiriladigan real CDI Mock simulyatsiyasi',
      'IELTS Speaking Part 2 va 3 bo\'yicha chuqurlashtirilgan mashqlar',
      'Keng qamrovli xatolar tahlili va individual mentor yordami'
    ],
    recommendedFor: 'IELTS 7.0+ va xorijiy universitetlarga grant yutishni maqsad qilganlar uchun'
  },
  {
    id: 'advanced',
    levelKey: 'advanced',
    titleKey: 'levels.advanced.label',
    descKey: 'levels.advanced.desc',
    cefr: 'C1 – C2',
    targetIelts: '7.5 – 8.5+',
    duration: '5–6 oy / months',
    monthlyPrice: '700 000',
    planId: 'advanced',
    badge: 'IELTS Mastery 8.5+',
    accentColor: '#e11d48',
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    features: [
      'levels.advanced.f1',
      'levels.advanced.f2',
      'levels.advanced.f3',
    ],
    detailedHighlights: [
      'IELTS 8.5+ band strategiyalari va murakkab akademik tahlil',
      'AI orqali insho (Writing) baholash va so\'z birikmalarini boyitish',
      'British Council formati asosida to\'liq mock imtihonlar'
    ],
    recommendedFor: 'Top xalqaro sertifikatlar va eng yuqori ballarni xohlovchilar uchun'
  }
];

export const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Starter & Elementary',
    price: '500 000',
    currency: "so'm / oy",
    levels: 'Beginner — Elementary (A1 – B1)',
    description: "Boshlang'ich bosqichdagilar uchun mustahkam fundament va jonli muloqot kursi.",
    features: [
      'Haftasiga 3 marta asosiy darslar (90 daqiqa)',
      'Haftalik bepul Speaking Club mashg\'ulotlari',
      'Barcha darslik va tarqatma materiallar',
      'Individual uy vazifalarini tekshirish'
    ]
  },
  {
    id: 'standard',
    name: 'Pre-IELTS & Intensive',
    price: '600 000',
    currency: "so'm / oy",
    levels: 'Intermediate — Upper-Int (B1 – C1)',
    popular: true,
    description: "O'rta va yuqori darajadagilar uchun ravon muloqot, grammatika va IELTS tayyorgarligi.",
    features: [
      'Haftasiga 3 marta intensiv akademik darslar',
      'CDI Mock Simulator platformasidan cheksiz foydalanish',
      'Haftalik to\'liq IELTS Mock Test imtihoni',
      'Speaking & Writing bo\'yicha mentor fikri',
      'Speaking Club va munozara guruhlari'
    ]
  },
  {
    id: 'advanced',
    name: 'IELTS Mastery 8.5+',
    price: '700 000',
    currency: "so'm / oy",
    levels: 'Advanced Mastery (C1 – C2)',
    description: "Eng yuqori IELTS 7.5 - 8.5+ natijalari va professional ravonlik uchun maxsus dastur.",
    features: [
      'IELTS 8.0+ sertifikatiga ega bosh ustozlar darsi',
      'AI Essay Assessor va shaxsiy xatolar tahlili',
      'To\'liq CDI Reading & Listening amaliyoti',
      'Individual yondashuv va intensiv progress monitoringi',
      'Barcha xalqaro imtihon materiallari'
    ]
  }
];
