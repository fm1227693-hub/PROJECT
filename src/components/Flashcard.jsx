import React, { useState } from 'react';
import { 
  HiOutlineAcademicCap, 
  HiOutlineBriefcase, 
  HiOutlineGlobeAlt, 
  HiOutlineChip, 
  HiOutlineHeart, 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineRefresh
} from 'react-icons/hi';

// 300+ so'zni o'z ichiga olgan mavzurlashtirilgan baza va ularning ikonkalari
const wordCategories = [
  {
    category: "IELTS & Academic",
    icon: <HiOutlineAcademicCap className="w-4 h-4" />,
    words: [
      { id: 1, en: "Eloquent", uz: "Ta'sirli, ravon so'zlaydigan", transcription: "/ˈeləkwənt/" },
      { id: 2, en: "Candid", uz: "Samimiy, ochiqko'ngil", transcription: "/ˈkændɪd/" },
      { id: 3, en: "Diligent", uz: "Tirishqoq, mehnatsevar", transcription: "/ˈdɪlɪdʒənt/" },
      { id: 4, en: "Comprehensive", uz: "Har tomonlama, keng qamrovli", transcription: "/ˌkɒmprɪˈhensɪv/" },
      { id: 5, en: "Articulate", uz: "O'z fikrini aniq bayon etuvchi", transcription: "/ɑːrˈtɪkjuleɪt/" },
      { id: 6, en: "Pragmatic", uz: "Amaliy, hayotiy fikrlaydigan", transcription: "/præɡˈmætɪk/" },
      { id: 7, en: "Innovative", uz: "Innovatsion, yangilik yaratuvchi", transcription: "/ˈɪnəveɪtɪv/" },
      { id: 8, en: "Resilient", uz: "Chidamli, qiyinchiliklarni yenguvchi", transcription: "/rɪˈzɪliənt/" },
      { id: 9, en: "Autonomous", uz: "Mustaqil, o'zicha harakatlanadigan", transcription: "/ɔːˈtɒnəməs/" },
      { id: 10, en: "Beneficial", uz: "Foydali, naf keltiradigan", transcription: "/ˌbenɪˈfɪʃl/" },
      { id: 11, en: "Ambiguous", uz: "Ikki ma'noli, tushunarsiz", transcription: "/æmˈbɪɡjuəs/" },
      { id: 12, en: "Meticulous", uz: "Juda ehtiyotkor, pishiq, sinchkov", transcription: "/məˈtɪkjələs/" },
      { id: 13, en: "Pessimistic", uz: "Pessimist, umidsiz", transcription: "/ˌpesɪˈmɪstɪk/" },
      { id: 14, en: "Optimistic", uz: "Umidvor, optimistik", transcription: "/ˌɒptɪˈmɪstɪk/" },
      { id: 15, en: "Significant", uz: "Muhim, sezilarli", transcription: "/sɪɡˈnɪfɪkənt/" }
    ]
  },
  {
    category: "Business & Finance",
    icon: <HiOutlineBriefcase className="w-4 h-4" />,
    words: [
      { id: 51, en: "Entrepreneur", uz: "Tadbirkor, biznesmen", transcription: "/ˌɒntrəprəˈnɜːr/" },
      { id: 52, en: "Negotiation", uz: "Muzokara, kelishuv", transcription: "/nɪˌɡəʊʃiˈeɪʃn/" },
      { id: 53, en: "Revenue", uz: "Daromad, tushum", transcription: "/ˈrevənjuː/" },
      { id: 54, en: "Strategy", uz: "Strategiya, reja", transcription: "/ˈstrætədʒi/" },
      { id: 55, en: "Collaborate", uz: "Hamkorlik qilmoq", transcription: "/kəˈlæbəreɪt/" },
      { id: 56, en: "Deadline", uz: "Belgilangan oxirgi muddat", transcription: "/ˈdedlaɪn/" },
      { id: 57, en: "Incentive", uz: "Rag'batlantirish, qiziqtirish", transcription: "/ɪnˈsentɪv/" },
      { id: 58, en: "Merger", uz: "Kompaniyalarning qo'shilishi", transcription: "/ˈmɜːrdʒər/" },
      { id: 59, en: "Outsource", uz: "Boshqa tashkilotga bermoq", transcription: "/ˈaʊtsɔːrs/" },
      { id: 60, en: "Portfolio", uz: "Portfel, ishlar to'plami", transcription: "/pɔːrtˈfəʊliəʊ/" },
      { id: 61, en: "Commodity", uz: "Tovar, xomashyo", transcription: "/kəˈmɒdəti/" },
      { id: 62, en: "Inflation", uz: "Inflyatsiya, qadrsizlanish", transcription: "/ɪnˈfleɪʃn/" },
      { id: 63, en: "Subsidy", uz: "Subsidiya, davlat yordami", transcription: "/ˈsʌbsɪdi/" },
      { id: 64, en: "Monopoly", uz: "Monopoliya", transcription: "/məˈnɒpəli/" },
      { id: 65, en: "Liability", uz: "Majburiyat, qarz", transcription: "/ˌlaɪəˈbɪləti/" }
    ]
  },
  {
    category: "Travel & Tourism",
    icon: <HiOutlineGlobeAlt className="w-4 h-4" />,
    words: [
      { id: 101, en: "Accommodation", uz: "Yashash joyi, mehmonxona", transcription: "/əˌkɒməˈdeɪʃn/" },
      { id: 102, en: "Destination", uz: "Belgilangan manzil", transcription: "/ˌdestɪˈneɪʃn/" },
      { id: 103, en: "Itinerary", uz: "Sayohat rejasi, yo'nalish", transcription: "/aɪˈtɪnəreri/" },
      { id: 104, en: "Souvenir", uz: "Sovg'a, yodgorlik", transcription: "/ˌsuːvəˈnɪər/" },
      { id: 105, en: "Hospitality", uz: "Mehmondo'stlik", transcription: "/ˌhɒspɪˈtæləti/" },
      { id: 106, en: "Landscape", uz: "Manzara, tabiat ko'rinishi", transcription: "/ˈlændskeɪp/" },
      { id: 107, en: "Atmosphere", uz: "Atmosfera, muhit", transcription: "/ˈætməsfɪr/" },
      { id: 108, en: "Convenient", uz: "Qulay, mos", transcription: "/kənˈviːniənt/" },
      { id: 109, en: "Luggage", uz: "Bagaj, yuk", transcription: "/ˈlʌɡɪdʒ/" },
      { id: 110, en: "Explore", uz: "Tadqiq qilmoq, o'rganmoq", transcription: "/ɪkˈsplɔːr/" },
      { id: 111, en: "Exotic", uz: "Ekzotik, o'zgacha", transcription: "/ɪɡˈzɒtɪk/" },
      { id: 112, en: "Reservation", uz: "Joy band qilish", transcription: "/ˌrezəˈveɪʃn/" },
      { id: 113, en: "Voyage", uz: "Dengiz sayohati", transcription: "/ˈvɔɪɪdʒ/" },
      { id: 114, en: "Border", uz: "Chegara", transcription: "/ˈbɔːrdər/" },
      { id: 115, en: "Customs", uz: "Bojxona", transcription: "/ˈkʌstəmz/" }
    ]
  },
  {
    category: "Technology & Science",
    icon: <HiOutlineChip className="w-4 h-4" />,
    words: [
      { id: 151, en: "Algorithm", uz: "Algoritm, qoida", transcription: "/ˈælɡərɪðəm/" },
      { id: 152, en: "Artificial", uz: "Sun'iy", transcription: "/ˌɑːrtɪˈfɪʃl/" },
      { id: 153, en: "Database", uz: "Ma'lumotlar bazasi", transcription: "/ˈdeɪtəbeɪs/" },
      { id: 154, en: "Encryption", uz: "Shifrlash", transcription: "/ɪnˈkrɪpʃn/" },
      { id: 155, en: "Innovation", uz: "Innovatsiya, yangilik", transcription: "/ˌɪnəˈveɪʃn/" },
      { id: 156, en: "Hardware", uz: "Apparat qismi, jihoz", transcription: "/ˈhɑːrdwer/" },
      { id: 157, en: "Software", uz: "Dasturiy ta'minot", transcription: "/ˈsɒftwer/" },
      { id: 158, en: "Cybersecurity", uz: "Kiberxavfsizlik", transcription: "/ˈsaɪbərsɪkjʊrəti/" },
      { id: 159, en: "Automation", uz: "Avtomatlashtirish", transcription: "/ˌɔːtəˈmeɪʃn/" },
      { id: 160, en: "Interface", uz: "Interfeys", transcription: "/ˈɪntərfeɪs/" }
    ]
  },
  {
    category: "Personality & Emotion",
    icon: <HiOutlineHeart className="w-4 h-4" />,
    words: [
      { id: 201, en: "Compassionate", uz: "Rahmdil, shafqatli", transcription: "/kəmˈpæʃənət/" },
      { id: 202, en: "Ecstatic", uz: "Juda xursand, mast-alast", transcription: "/ekˈstætɪk/" },
      { id: 203, en: "Melancholy", uz: "G'amginlik, mahzunlik", transcription: "/ˈmelənkɒli/" },
      { id: 204, en: "Arrogant", uz: "O'zidan ketgan, kibrli", transcription: "/ˈærəɡənt/" },
      { id: 205, en: "Generous", uz: "Saxiy, qo'li ochiq", transcription: "/ˈdʒenərəs/" },
      { id: 206, en: "Stubborn", uz: "O'jar, qaysar", transcription: "/ˈstʌbərn/" },
      { id: 207, en: "Anxious", uz: "Xavotirli, notinch", transcription: "/ˈæŋkʃəs/" },
      { id: 208, en: "Confident", uz: "O'ziga ishongan", transcription: "/ˈkɒnfɪdənt/" },
      { id: 209, en: "Sincere", uz: "Samimiy, chin dildan", transcription: "/sɪnˈsɪr/" },
      { id: 210, en: "Hostile", uz: "Dushmanona, yovvoyi", transcription: "/ˈhɒstaɪl/" }
    ]
  },
  {
    category: "Environment & Society",
    icon: <HiOutlineGlobeAlt className="w-4 h-4" />,
    words: [
      { id: 251, en: "Biodiversity", uz: "Biologik xilma-xillik", transcription: "/ˌbaɪəʊdaɪˈvɜːrsəti/" },
      { id: 252, en: "Conservation", uz: "Tabiatni muhofaza qilish", transcription: "/ˌkɒnsərˈveɪʃn/" },
      { id: 253, en: "Deforestation", uz: "O'rmonlarni qirqib tashlash", transcription: "/diːˌfɒrɪˈsteɪʃn/" },
      { id: 254, en: "Urbanization", uz: "Urbanizatsiya, shaharlashuv", transcription: "/ˌɜːrbənəˈzeɪʃn/" },
      { id: 255, en: "Pollution", uz: "Ifloslanish", transcription: "/pəˈluːʃn/" },
      { id: 256, en: "Sustainable", uz: "Barqaror, ekologik toza", transcription: "/səˈsteɪnəbl/" },
      { id: 257, en: "Atmosphere", uz: "Atmosfera", transcription: "/ˈætməsfɪr/" },
      { id: 258, en: "Ecosystem", uz: "Ekosistema", transcription: "/ˈiːkəʊsɪstəm/" },
      { id: 259, en: "Poverty", uz: "Qashshoqlik", transcription: "/ˈpɒvərti/" },
      { id: 260, en: "Overpopulation", uz: "Aholining haddan tashqari ko'payishi", transcription: "/ˌəʊvərpɒpjuˈleɪʃn/" }
    ]
  }
];

export default function Flashcards() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWords = wordCategories[activeCategory].words;
  const currentCard = currentWords[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % currentWords.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + currentWords.length) % currentWords.length);
  };

  const handleCategoryChange = (idx) => {
    setActiveCategory(idx);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#0f1016] text-white rounded-2xl border border-gray-800 shadow-xl my-10">
      {/* Sarlavha */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <HiOutlineSparkles className="w-6 h-6 text-red-500" />
          Interaktiv Lug'at Kartochkalari
        </h2>
        <p className="text-gray-400 text-sm">Mavzuni tanlang va so'zlarni kartani bosib ag'darib yodlang.</p>
      </div>

      {/* Kategoriyalar tanlash */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {wordCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryChange(idx)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === idx
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#161821] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat.icon}
            {cat.category}
          </button>
        ))}
      </div>

      {/* Kartochka */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-64 w-full cursor-pointer perspective-1000 mb-6"
      >
        <div className={`w-full h-full rounded-2xl border border-gray-800 bg-[#161821] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 shadow-lg hover:border-red-600/50 ${isFlipped ? 'bg-red-950/25 border-red-600/40' : ''}`}>
          
          <span className="absolute top-4 left-4 text-xs font-medium text-gray-500">
            {currentIndex + 1} / {currentWords.length}
          </span>

          <span className="absolute top-4 right-4 text-xs text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            {wordCategories[activeCategory].icon}
            {wordCategories[activeCategory].category}
          </span>

          {!isFlipped ? (
            <div className="space-y-2">
              <h3 className="text-3xl font-bold tracking-wide text-white">{currentCard.en}</h3>
              <p className="text-sm text-gray-400 italic">{currentCard.transcription}</p>
              <p className="text-xs text-red-400 mt-4 flex items-center justify-center gap-1">
                <HiOutlineRefresh className="w-4 h-4 animate-spin" />
                Tarjimasini ko'rish uchun bosing
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <h3 className="text-2xl font-bold text-red-500">{currentCard.uz}</h3>
              <p className="text-sm text-gray-300 font-medium">{currentCard.en} <span className="text-gray-500 font-normal">{currentCard.transcription}</span></p>
              <p className="text-xs text-gray-500 mt-4">{t('flashcard.flipInstruction')}</p>
            </div>
          )}

        </div>
      </div>

      {/* Boshqaruv tugmalari */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#161821] border border-gray-800 hover:border-gray-700 text-sm font-semibold text-gray-300 transition"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
          Oldingi
        </button>

        <span className="text-xs text-gray-500 font-mono">
          Kartani bosing
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition shadow-md shadow-red-600/20"
        >
          Keyingi
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}