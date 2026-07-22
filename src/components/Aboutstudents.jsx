import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Aboutstudents({ onBack }) {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 pt-10 mb-24 select-none font-sans bg-gray-50 dark:bg-gray-950 min-h-screen">
      <button 
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-800 dark:text-white rounded-xl font-medium cursor-pointer hover:bg-gray-300 transition-colors"
      >
        {t('aboutStudents.backButton')}
      </button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {t('aboutStudents.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        {t('aboutStudents.description')}
      </p>
    </div>
  )
}