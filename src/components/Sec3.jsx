import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Sec3() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

    const teachers = [
        {
            id: 'dovudxon',
            name: 'Ruhillo Asrorov',
            image: 'public/photo_2026-07-23_23-14-12.jpg',
            score: '8.0',
            cert: 'CELTA',
            experience: '10+',
            students: '3500+',
        },
        {
            id: 'zarnigor',
            name: 'Zarnigor Okkanyova',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
            score: '8.5',
            cert: 'CELTA',
            experience: '4+',
            students: '500+',
        },
        {
            id: 'gulasal',
            name: 'Gulasal Butaeva',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
            score: '9.0',
            cert: 'TESOL',
            experience: '5+',
            students: '600+',
        },
    ]

    const [activeTeacher, setActiveTeacher] = useState(teachers[0])
    const [displayedText, setDisplayedText] = useState('')

    // Sizning JSON tuzilmangizga mos ravishda to'g'ridan-to'g'ri chaqirildi
    const currentTeacherData = t(activeTeacher.id, { returnObjects: true, defaultValue: {} })

    // Matnni xatolarsiz, to'g'ri va ravon harfma-harf chiqarish effekti
    useEffect(() => {
        setDisplayedText('')
        let i = 0
        const fullText = currentTeacherData?.description || ''

        const typingInterval = setInterval(() => {
            if (i <= fullText.length) {
                setDisplayedText(fullText.substring(0, i))
                i++
            } else {
                clearInterval(typingInterval)
            }
        }, 50)

        return () => clearInterval(typingInterval)
    }, [activeTeacher, currentTeacherData?.description])

    return (
        <div data-aos="fade-up" data-aos-duration="800" className="max-w-7xl mx-auto px-6 lg:px-8 mt-[96px] mb-24 select-none font-sans transition-colors duration-200">
            
            {/* Yuqori qismdagi o'qituvchilar tanlash tugmalari (Tabs) */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-8 scrollbar-none">
                {teachers.map((teacher) => {
                    const isActive = activeTeacher.id === teacher.id
                    const tData = t(teacher.id, { returnObjects: true, defaultValue: {} })
                    return (
                        <button
                            key={teacher.id}
                            onClick={() => setActiveTeacher(teacher)}
                            className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 shrink-0 border ${
                                isActive
                                    ? 'bg-white dark:bg-gray-900 border-red-500 shadow-lg scale-105'
                                    : 'bg-gray-900/40 dark:bg-gray-900/60 border-transparent hover:border-gray-700 opacity-70 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={teacher.image}
                                alt={teacher.name}
                                className="w-8 h-8 rounded-full object-cover border border-red-500"
                            />
                            <div className="text-left">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                    {teacher.name.split(' ')[0]}
                                </h4>
                                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                                    {tData?.role || ''}
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Asosiy Grid qism */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Chap tomon: Tanlangan o'qituvchining rasmi */}
                <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100/50 dark:border-gray-800 relative group bg-gray-900">
                    <img
                        src={activeTeacher.image}
                        alt={activeTeacher.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20 dark:border-gray-800">
                            <span className="text-2xl font-black text-red-600 dark:text-red-400 block">
                                {activeTeacher.score}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                IELTS Instructor
                            </span>
                        </div>
                        <div className="text-right text-white">
                            <h3 className="text-xl font-extrabold">{activeTeacher.name}</h3>
                            <p className="text-xs text-red-400 font-medium">{currentTeacherData?.expert || 'Expert Mentor'}</p>
                        </div>
                    </div>
                </div>

                {/* O'ng tomon: Ma'lumotlar va animatsiyali matn */}
                <div className="flex flex-col space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold w-fit">
                        {t('sec3Badge', 'Professional Teachers')}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                        {t('sec3Title', 'Meet Our Expert')} <span className="text-red-600 dark:text-red-400">{activeTeacher.name}</span>
                    </h2>

                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed min-h-[72px]">
                        {displayedText}
                        <span className="inline-block w-1.5 h-4 ml-1 bg-red-500 animate-pulse align-middle"></span>
                    </p>

                    {/* 4 ta statistika katakchasi */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                            <span className="text-2xl font-black text-gray-900 dark:text-white">{activeTeacher.score}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{currentTeacherData?.scoreTitle}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                            <span className="text-2xl font-black text-red-600 dark:text-red-400">{activeTeacher.cert}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{currentTeacherData?.certDesc}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                            <span className="text-2xl font-black text-gray-900 dark:text-white">{activeTeacher.experience}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{currentTeacherData?.experienceText}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                            <span className="text-2xl font-black text-red-600 dark:text-red-400">{activeTeacher.students}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{currentTeacherData?.studentsText}</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}