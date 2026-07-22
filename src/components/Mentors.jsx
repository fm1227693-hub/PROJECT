import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const staticMentorsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    telegram: "https://t.me/username",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    telegram: "https://t.me/username",
  },
];

export default function Mentors() {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [toast, setToast] = useState(false);

  // JSON dan tarjima qilingan mentorlar massivini olish
  const translatedMentors = t('mentors.list', { returnObjects: true }) || [];

  // Rasmlar va tarjima ma'lumotlarini birlashtiramiz
  const mentorsData = translatedMentors.map((mentor, index) => ({
    ...mentor,
    id: staticMentorsData[index]?.id || index + 1,
    image: staticMentorsData[index]?.image || "",
    telegram: staticMentorsData[index]?.telegram || "",
  }));

  // Formani yuborish funksiyasi
  const handleSubmit = (e) => {
    e.preventDefault();
    setModal(false);

    // Toastni chiqarish va 3 sekunddan keyin yopish
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 3000);
  };

  return (
    <section className="bg-white dark:bg-[#090623] py-16 px-4 md:px-8 text-gray-900 dark:text-white relative transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Sarlavha qismi */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('mentors.sectionTitle')}</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('mentors.sectionDesc')}
          </p>
        </div>

        {/* Kartochkalar grid qismi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mentorsData.slice(0, 2).map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-gray-300 dark:hover:border-slate-700 transition shadow-sm dark:shadow-none"
            >
              {/* Rasm qismi */}
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 rounded-xl object-cover border-2 border-red-500/20"
              />

              {/* Ma'lumotlar qismi */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl font-semibold">{mentor.name}</h3>
                  <span className="text-xs bg-red-500/10 text-red-500 dark:text-red-400 px-3 py-1 rounded-full font-medium w-fit mx-auto sm:mx-0">
                    {mentor.experience}
                  </span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-3">{mentor.role}</p>
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">{mentor.bio}</p>

                {/* Yo'nalishlar (Skills) */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
                  {mentor.skills && mentor.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Tugma */}
                <button
                  onClick={() => {
                    setSelectedMentor(mentor.name);
                    setModal(true);
                  }}
                  className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition w-full sm:w-auto text-center cursor-pointer shadow-sm"
                >
                  {t('mentors.contactBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Oyna */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md relative text-gray-900 dark:text-white shadow-2xl">
            {/* Yopish tugmasi (X) */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-2">{t('mentors.modalTitle')}</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
              {t('mentors.selectedTeacher')} <span className="text-red-600 dark:text-red-400 font-medium">{selectedMentor}</span>
            </p>

            {/* Forma */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-slate-300 mb-1">{t('mentors.nameLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('mentors.namePlaceholder')}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-slate-300 mb-1">{t('mentors.phoneLabel')}</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer shadow-sm"
              >
                {t('mentors.submitBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <span>✅ {t('mentors.successToast')}</span>
        </div>
      )}
    </section>
  );
}