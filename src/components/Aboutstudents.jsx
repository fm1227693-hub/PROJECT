import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Aboutstudents({ onBack }) {
  const { t } = useTranslation()

  useEffect(() => {
    AOS.init({
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 mb-24 select-none font-sans bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Orqaga qaytish tugmasi (Fade-down animatsiyasi bilan) */}
      <button
        onClick={onBack}
        data-aos="fade-down"
        data-aos-duration="600"
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-800 dark:text-white rounded-xl font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        {t('aboutStudents.backButton')}
      </button>

      {/* Sarlavha (Fade-up animatsiyasi bilan) */}
      <h2
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="100"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
      >
        {t('aboutStudents.title')}
      </h2>

      {/* Tavsif (Fade-up animatsiyasi va kechikish bilan) */}
      <p
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
        className="text-gray-600 dark:text-gray-400 mt-3 text-base sm:text-lg leading-relaxed max-w-3xl"
      >
        {t('aboutStudents.description')}
      </p>
    </div>
  )
}