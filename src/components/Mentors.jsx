import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AOS from 'aos';
import 'aos/dist/aos.css';

const staticMentorsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    telegram: "https://t.me/username1",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    telegram: "https://t.me/username2",
  },
];

export default function Mentors() {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [toast, setToast] = useState(false);

  // Forma state-lari
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    AOS.init({
      once: true,
      offset: 100,
    });
  }, []);

  // JSON dan tarjima qilingan mentorlar massivini olish
  const translatedMentors = t('mentors.list', { returnObjects: true }) || [];

  // Rasmlar, telegram havolalari va tarjima ma'lumotlarini birlashtiramiz
  const mentorsData = translatedMentors.map((mentor, index) => ({
    ...mentor,
    id: staticMentorsData[index]?.id || index + 1,
    image: staticMentorsData[index]?.image || "",
    telegram: staticMentorsData[index]?.telegram || "https://t.me/username",
  }));

  // Inputlardagi o'zgarishlarni boshqarish
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Formani yuborish funksiyasi
  const handleSubmit = (e) => {
    e.preventDefault();
    setModal(false);

    // Formani tozalash
    setFormData({ name: "", phone: "" });

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
        <div
          data-aos="fade-down"
          data-aos-duration="600"
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t('mentors.sectionTitle')}</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            {t('mentors.sectionDesc')}
          </p>
        </div>

        {/* Kartochkalar grid qismi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mentorsData.slice(0, 2).map((mentor, index) => (
            <div
              key={mentor.id}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 150}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center hover:border-red-500/50 dark:hover:border-red-500/50 transition-all shadow-md dark:shadow-none group"
            >
              {/* Rasm qismi va Telegram link */}
              <div className="relative group/img">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-red-500/20 group-hover:scale-105 transition-transform duration-500 shadow-sm"
                />
                <a
                  href={mentor.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                  title="Telegram chat"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.228-.46-1.903-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.163.331.011.103.024.337.01.521z" />
                  </svg>
                </a>
              </div>

              {/* Ma'lumotlar qismi */}
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl font-bold">{mentor.name}</h3>
                  <span className="text-xs bg-red-500/10 text-red-500 dark:text-red-400 px-3 py-1 rounded-full font-bold w-fit mx-auto sm:mx-0">
                    {mentor.experience}
                  </span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-3">{mentor.role}</p>
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">{mentor.bio}</p>

                {/* Yo'nalishlar (Skills) */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
                  {mentor.skills && mentor.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200/75 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium">
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
                  className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto text-center cursor-pointer shadow-lg shadow-red-500/20"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md relative text-gray-900 dark:text-white shadow-2xl">

            {/* O'ta ko'rininarli va chiroyli yopish / orqaga (X) tugmasi */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-5 right-5 w-10 h-10 bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-600 dark:hover:text-white rounded-2xl flex items-center justify-center text-lg font-bold cursor-pointer transition-all shadow-sm hover:rotate-90"
              title="Orqaga / Yopish"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black mb-2 pr-10">{t('mentors.modalTitle')}</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
              {t('mentors.selectedTeacher')} <span className="text-red-600 dark:text-red-400 font-bold">{selectedMentor}</span>
            </p>

            {/* Forma */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 uppercase tracking-wider">{t('mentors.nameLabel')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('mentors.namePlaceholder')}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 uppercase tracking-wider">{t('mentors.phoneLabel')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-500/20 text-sm sm:text-base mt-2"
              >
                {t('mentors.submitBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold animate-bounce text-sm">
          <span>✅ {t('mentors.successToast')}</span>
        </div>
      )}
    </section>
  );
}