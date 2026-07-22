import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AboutStudents({ onBack }) {
  const { t } = useTranslation()

  useEffect(() => {
    AOS.init({
      once: true,
      offset: 100,
    })

    return () => {
      AOS.refreshHard()
    }
  }, [])

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    }
  }

  return (
    <section
      className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 mb-20 sm:mb-24 select-none font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200 min-h-screen"
      aria-labelledby="about-students-title"
    >
      {/* Orqaga qaytish tugmasi */}
      <button
        type="button"
        onClick={handleBack}
        data-aos="fade-down"
        data-aos-duration="600"
        className="mb-6 sm:mb-8 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-800 text-xs sm:text-sm rounded-xl font-semibold cursor-pointer active:scale-95 transition-all shadow-sm"
      >
        ← {t('aboutStudents.backButton')}
      </button>

      {/* Sarlavha qismi */}
      <div className="space-y-3 sm:space-y-4 max-w-4xl">
        <span
          data-aos="fade-up"
          data-aos-delay="50"
          className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30"
        >
          {t('aboutStudents.badge') || "Talabalar haqida"}
        </span>

        <h2
          id="about-students-title"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
        >
          {t('aboutStudents.title')}
        </h2>

        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
          className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-medium"
        >
          {t('aboutStudents.description')}
        </p>
      </div>

      {/* Kelgusida talabalar kartochkalari yoki ro'yxatini shu yerga qo'shishingiz mumkin */}
    </section>
  )
}