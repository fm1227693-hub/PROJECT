import React, { useState, useEffect, useRef, useCallback } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
    // Level 1: Starter (1-8)
    { id: 1, level: 1, q: "'Excuse me, _____ you speak English?'", options: ['do', 'are', 'is', 'have'], answer: 0 },
    { id: 2, level: 1, q: "'_____ are you from?' 'I am from Italy.'", options: ['What', 'Where', 'Who', 'How'], answer: 1 },
    { id: 3, level: 1, q: "'I _____ a student.'", options: ['are', 'is', 'am', 'be'], answer: 2 },
    { id: 4, level: 1, q: "'She _____ got a brother.'", options: ['have', 'has', 'having', 'is'], answer: 1 },
    { id: 5, level: 1, q: "'My mother is a doctor. _____ works in a hospital.'", options: ['He', 'She', 'They', 'It'], answer: 1 },
    { id: 6, level: 1, q: "'What time _____ it?'", options: ['is', 'are', 'am', 'does'], answer: 0 },
    { id: 7, level: 1, q: "'I like _____ football on weekends.'", options: ['play', 'playing', 'played', 'plays'], answer: 1 },
    { id: 8, level: 1, q: "'_____ there a bank near here?'", options: ['Am', 'Are', 'Is', 'Do'], answer: 2 },

    // Level 2: Elementary (9-16)
    { id: 9, level: 2, q: "'I _____ to the cinema yesterday.'", options: ['go', 'went', 'gone', 'going'], answer: 1 },
    { id: 10, level: 2, q: "'_____ you ever been to Paris?'", options: ['Did', 'Do', 'Have', 'Are'], answer: 2 },
    { id: 11, level: 2, q: "'If it rains tomorrow, we _____ stay at home.'", options: ['will', 'would', 'do', 'are'], answer: 0 },
    { id: 12, level: 2, q: "'This is the _____ book I have ever read.'", options: ['good', 'better', 'best', 'more good'], answer: 2 },
    { id: 13, level: 2, q: "'I _____ my homework when the phone rang.'", options: ['was doing', 'did', 'do', 'am doing'], answer: 0 },
    { id: 14, level: 2, q: "'He _____ in London for five years.'", options: ['lives', 'is living', 'has lived', 'live'], answer: 2 },
    { id: 15, level: 2, q: "'You _____ smoke in the hospital.'", options: ["don't have to", "mustn't", "needn't", "won't"], answer: 1 },
    { id: 16, level: 2, q: "'The letter _____ yesterday.'", options: ['is sent', 'sent', 'was sent', 'has sent'], answer: 2 },

    // Level 3: Intermediate (17-24)
    { id: 17, level: 3, q: "'If I _____ you, I would study harder.'", options: ['am', 'was', 'were', 'be'], answer: 2 },
    { id: 18, level: 3, q: "'She told me that she _____ to leave.'", options: ['wants', 'wanted', 'is wanting', 'has wanted'], answer: 1 },
    { id: 19, level: 3, q: "'I am looking forward to _____ you.'", options: ['see', 'seeing', 'saw', 'be seeing'], answer: 1 },
    { id: 20, level: 3, q: "'He is used to _____ early.'", options: ['get up', 'getting up', 'got up', 'gets up'], answer: 1 },
    { id: 21, level: 3, q: "'By this time next year, I _____ my studies.'", options: ['will finish', 'will have finished', 'am finishing', 'finished'], answer: 1 },
    { id: 22, level: 3, q: "'I wish I _____ a car.'", options: ['have', 'had', 'has', 'having'], answer: 1 },
    { id: 23, level: 3, q: "'_____ the heavy rain, we decided to go out.'", options: ['Although', 'Despite', 'However', 'Because'], answer: 1 },
    { id: 24, level: 3, q: "'She asked me where _____.'", options: ['I live', 'do I live', 'I lived', 'did I live'], answer: 2 },

    // Level 4: Upper-Intermediate (25-32)
    { id: 25, level: 4, q: "'Hardly _____ left the house when it started to rain.'", options: ['I had', 'had I', 'did I', 'I did'], answer: 1 },
    { id: 26, level: 4, q: "'It’s high time you _____ a job.'", options: ['get', 'got', 'will get', 'getting'], answer: 1 },
    { id: 27, level: 4, q: "'He denied _____ the money.'", options: ['to steal', 'stealing', 'steal', 'stolen'], answer: 1 },
    { id: 28, level: 4, q: "'I would rather you _____ that.'", options: ['not do', "didn't do", "don't do", "won't do"], answer: 1 },
    { id: 29, level: 4, q: "'Not only _____ late, but he also forgot his books.'", options: ['he arrived', 'arrived he', 'did he arrive', 'he did arrive'], answer: 2 },
    { id: 30, level: 4, q: "'If he had studied harder, he _____ the exam.'", options: ['would pass', 'will pass', 'would have passed', 'passed'], answer: 2 },
    { id: 31, level: 4, q: "'The man _____ wallet was stolen went to the police.'", options: ['who', 'which', 'whose', 'whom'], answer: 2 },
    { id: 32, level: 4, q: "'You had better _____ a doctor.'", options: ['see', 'to see', 'seeing', 'saw'], answer: 0 },

    // Level 5: Advanced (33-36)
    { id: 33, level: 5, q: "'_____ you to change your mind, let me know.'", options: ['If', 'Should', 'Were', 'Had'], answer: 1 },
    { id: 34, level: 5, q: "'He was on the verge of _____.'", options: ['cry', 'to cry', 'crying', 'cried'], answer: 2 },
    { id: 35, level: 5, q: "'The company is rumored _____ bankrupt last year.'", options: ['to go', 'going', 'to have gone', 'gone'], answer: 2 },
    { id: 36, level: 5, q: "'Scarcely _____ the speech when the audience erupted in applause.'", options: ['finished he', 'he had finished', 'had he finished', 'did he finish'], answer: 2 },

    // Level 6: Proficiency (37-40)
    { id: 37, level: 6, q: "'_____ it not been for your help, I would have failed.'", options: ['Had', 'Were', 'If', 'Should'], answer: 0 },
    { id: 38, level: 6, q: "'She has a _____ for languages.'", options: ['flair', 'tendency', 'habit', 'skill'], answer: 0 },
    { id: 39, level: 6, q: "'His argument was so _____ that no one could disagree.'", options: ['cogent', 'ambiguous', 'tenuous', 'flimsy'], answer: 0 },
    { id: 40, level: 6, q: "'The government’s decision was met with _____ criticism.'", options: ['heavy', 'strong', 'fierce', 'deep'], answer: 2 }
]

const TOTAL_TIME = 30 * 60

const LEVELS = [
    { key: 'starter', label: 'Starter', min: 0, color: '#94a3b8' },
    { key: 'beginner', label: 'Beginner', min: 20, color: '#38bdf8' },
    { key: 'elementary', label: 'Elementary', min: 38, color: '#34d399' },
    { key: 'intermediate', label: 'Intermediate', min: 58, color: '#fbbf24' },
    { key: 'upperIntermediate', label: 'Upper-Intermediate', min: 76, color: '#fb923c' },
    { key: 'advanced', label: 'Advanced', min: 90, color: '#ef4444' },
]

function getLevel(percent) {
    let result = LEVELS[0]
    for (const lvl of LEVELS) {
        if (percent >= lvl.min) result = lvl
    }
    return result
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

export default function LevelTest() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [stage, setStage] = useState('intro')
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
    const [finished, setFinished] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [direction, setDirection] = useState('next')
    const timerRef = useRef(null)

    

    useEffect(() => {
        if (stage !== 'test' || finished) return
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    handleAutoFinish()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [stage, finished])

    // Hide Navbar and Footer when not in intro stage
    useEffect(() => {
        const navbar = document.querySelector('header')?.parentElement;
        const footer = document.querySelector('footer');
        
        if (stage !== 'intro') {
            if (navbar) navbar.style.display = 'none';
            if (footer) footer.style.display = 'none';
        } else {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
        }
        
        return () => {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
        }
    }, [stage])

    const handleAutoFinish = useCallback(() => {
        setFinished(true)
        toast.error(t('levelTest.timeUp') || "Vaqt tugadi!", {
            id: 'time-up',
            position: 'top-center',
            duration: 3000,
        })
    }, [t])

    const startTest = () => {
        setStage('test')
        setCurrent(0)
        setAnswers({})
        setTimeLeft(TOTAL_TIME)
        setFinished(false)
        setShowResult(false)
    }

    const selectAnswer = (qId, optionIdx) => {
        if (finished) return
        setAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
    }

    const goNext = () => {
        if (current < QUESTIONS.length - 1) {
            setDirection('next')
            setCurrent((c) => c + 1)
        }
    }
    const goPrev = () => {
        if (current > 0) {
            setDirection('prev')
            setCurrent((c) => c - 1)
        }
    }

    const manualFinish = () => {
        clearInterval(timerRef.current)
        setFinished(true)
        toast.success(t('levelTest.testFinished') || 'Test yakunlandi', {
            position: 'top-center',
            duration: 2000,
        })
    }

    const computeScore = () => {
        let correct = 0
        QUESTIONS.forEach((q) => {
            if (answers[q.id] === q.answer) correct += 1
        })
        const percent = Math.round((correct / QUESTIONS.length) * 100)
        return { correct, total: QUESTIONS.length, percent, level: getLevel(percent) }
    }

    const revealResult = () => {
        setShowResult(true)
        setStage('result')
    }

    const answeredCount = Object.keys(answers).length
    const q = QUESTIONS[current]
    const handleExit = () => {
        if (stage === 'test' && !finished) {
            toast.custom(
                (toastItem) => (
                    <div className={`${toastItem.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex flex-col gap-4 p-5 sm:p-6 border border-gray-100 dark:border-gray-800 font-['Plus_Jakarta_Sans',sans-serif]`}>
                        <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-white text-center leading-snug">
                            {t('levelTest.leaveConfirm') || "Testni tark etmoqchimisiz? Natijangiz saqlanmaydi."}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => toast.dismiss(toastItem.id)}
                                className="flex-1 py-3 text-xs sm:text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent dark:border-gray-700"
                            >
                                {t('levelTest.cancelBtn') || "Bekor qilish"}
                            </button>
                            <button
                                onClick={() => {
                                    toast.dismiss(toastItem.id)
                                    navigate(-1)
                                }}
                                className="flex-1 py-3 text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg shadow-red-500/20 cursor-pointer"
                            >
                                {t('levelTest.exitBtn') || "Chiqish"}
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity, id: 'exit-confirm' }
            )
        } else {
            navigate(-1)
        }
    }

    const ExitBtn = () => (
        <button
            onClick={handleExit}
            className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer hover:shadow-xl active:scale-95 border border-red-500/50"
        >
            {t('levelTest.exitBtn') || 'Chiqish'}
        </button>
    )
    // INTRO
    if (stage === 'intro') {
        return (
            <div className="min-h-screen flex items-center justify-center px-3 xs:px-4 pt-16 xs:pt-20 pb-8 xs:pb-12 transition-colors duration-200 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
                <Toaster position="top-center" />

                <div
                    data-aos="zoom-in"
                    data-aos-duration="600"
                    className="max-w-lg w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 xs:p-7 sm:p-10 rounded-2xl xs:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/80 text-center relative z-10 animate-fade-in-up"
                >
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full inline-block">
                        {t('levelTest.badge') || 'Darajani aniqlash'}
                    </span>
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3 xs:mt-4 tracking-tight">
                        {t('levelTest.title') || 'Ingliz tili darajangizni bilib oling'}
                    </h2>
                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-2.5 xs:mt-3 leading-relaxed">
                        {t('levelTest.description') ||
                            '40 ta savoldan iborat test orqali darajangiz aniqlanadi. Qiyinlik darajasi asta-sekin oshib boradi.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 xs:gap-3 mt-5 xs:mt-6 text-left">
                        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl xs:rounded-2xl p-3.5 xs:p-4 border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900 transition-colors">
                            <p className="text-[10px] xs:text-xs font-bold text-gray-400 uppercase tracking-wider">{t('levelTest.questionsLabel') || 'Savollar'}</p>
                            <p className="text-lg xs:text-xl font-black text-gray-900 dark:text-white mt-1">40 ta</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl xs:rounded-2xl p-3.5 xs:p-4 border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900 transition-colors">
                            <p className="text-[10px] xs:text-xs font-bold text-gray-400 uppercase tracking-wider">{t('levelTest.timeLabel') || 'Vaqt'}</p>
                            <p className="text-lg xs:text-xl font-black text-gray-900 dark:text-white mt-1">30 min</p>
                        </div>
                    </div>

                    <button
                        onClick={startTest}
                        className="w-full mt-6 xs:mt-7 bg-red-600 hover:bg-red-700 text-white font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {t('levelTest.startBtn') || 'Testni boshlash'}
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-2.5 xs:mt-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm cursor-pointer active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                        {t('levelTest.cancelBtn') || 'Bekor qilish'}
                    </button>
                </div>
                <style>{styleBlock}</style>
            </div>
        )
    }

    // RESULT
    if (stage === 'result' && showResult) {
        const { correct, total, percent, level } = computeScore()
        return (
            <div className="min-h-screen flex items-center justify-center px-3 xs:px-4 pt-16 xs:pt-20 pb-8 xs:pb-12 transition-colors duration-200 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
                <Toaster position="top-center" />
                <ExitBtn />

                <div
                    data-aos="zoom-in"
                    data-aos-duration="600"
                    className="max-w-lg w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 xs:p-7 sm:p-10 rounded-2xl xs:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/80 text-center relative z-10 animate-fade-in-up"
                >
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full inline-block">
                        {t('levelTest.resultBadge') || 'Natija'}
                    </span>

                    <div
                        className="w-24 h-24 xs:w-32 xs:h-32 rounded-full mx-auto mt-5 xs:mt-6 flex items-center justify-center border-8 animate-scale-in"
                        style={{ borderColor: level.color + '33' }}
                    >
                        <div className="text-center">
                            <p className="text-2xl xs:text-3xl font-black text-gray-900 dark:text-white leading-none">{percent}%</p>
                        </div>
                    </div>

                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black mt-4 xs:mt-5 tracking-tight" style={{ color: level.color }}>
                        {level.label}
                    </h2>
                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {(t('levelTest.correctOf') || "{{correct}} ta savoldan {{total}} tasiga to'g'ri javob berdingiz")
                            .replace('{{correct}}', correct)
                            .replace('{{total}}', total)}
                    </p>

                    <div className="mt-5 xs:mt-6 grid grid-cols-3 gap-1.5 xs:gap-2">
                        {LEVELS.map((lvl) => (
                            <div
                                key={lvl.key}
                                className={`rounded-lg xs:rounded-xl py-1.5 xs:py-2 text-[9px] xs:text-[11px] font-bold border transition-all ${lvl.key === level.key
                                    ? 'text-white'
                                    : 'text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800'
                                    }`}
                                style={lvl.key === level.key ? { backgroundColor: lvl.color, borderColor: lvl.color } : {}}
                            >
                                {lvl.label}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/pricing', { state: { levelKey: level.key, levelLabel: level.label } })}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 hover:-translate-y-0.5"
                    >
                        {t('levelTest.continueBtn') || 'Davom etish'}
                    </button>

                    <button
                        onClick={startTest}
                        className="w-full mt-2.5 xs:mt-3 bg-gray-900 dark:bg-white hover:opacity-90 text-white dark:text-gray-900 font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm cursor-pointer active:scale-95"
                    >
                        {t('levelTest.retakeBtn') || 'Qayta topshirish'}
                    </button>
                </div>
                <style>{styleBlock}</style>
            </div>
        )
    }

    // FINISHED but result hidden
    if (finished && !showResult) {
        return (
            <div className="min-h-screen flex items-center justify-center px-3 xs:px-4 pt-16 xs:pt-20 pb-8 xs:pb-12 transition-colors duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
                <Toaster position="top-center" />
                <ExitBtn />

                <div
                    data-aos="zoom-in"
                    data-aos-duration="600"
                    className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 xs:p-7 sm:p-10 rounded-2xl xs:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/80 text-center animate-fade-in-up"
                >
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full inline-block">
                        {t('levelTest.doneBadge') || 'Test yakunlandi'}
                    </span>
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3 xs:mt-4 tracking-tight">
                        {t('levelTest.readyMsg') || 'Natijangiz tayyor'}
                    </h2>
                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {(t('levelTest.answeredMsg') || "{{answered}} / {{total}} savolga javob berdingiz")
                            .replace('{{answered}}', answeredCount)
                            .replace('{{total}}', QUESTIONS.length)}
                    </p>
                    <button
                        onClick={revealResult}
                        className="w-full mt-6 xs:mt-7 bg-red-600 hover:bg-red-700 text-white font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 hover:-translate-y-0.5"
                    >
                        {t('levelTest.seeScoreBtn') || "Ballni ko'rish"}
                    </button>
                </div>
                <style>{styleBlock}</style>
            </div>
        )
    }

    // TEST
    return (
        <div className="min-h-screen flex items-center justify-center px-3 xs:px-4 pt-16 xs:pt-20 pb-8 xs:pb-12 transition-colors duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
            <Toaster position="top-center" />
            <ExitBtn />
            <div
                data-aos="fade-up"
                data-aos-duration="500"
                className="max-w-xl w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 xs:p-6 sm:p-9 rounded-2xl xs:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/80"
            >
                <div className="flex items-center justify-between mb-4 xs:mb-5">
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full">
                        {current + 1} / {QUESTIONS.length}
                    </span>
                    <span
                        className={`text-xs xs:text-sm font-black tabular-nums px-2.5 xs:px-3 py-1 rounded-full transition-colors ${timeLeft <= 60
                            ? 'text-red-600 bg-red-50 dark:bg-red-500/10 animate-pulse'
                            : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                            }`}
                    >
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6 xs:mb-7">
                    <div
                        className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <h3
                    key={q.id}
                    className="text-base xs:text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-snug mb-5 xs:mb-6 animate-slide-in"
                >
                    {q.q}
                </h3>

                <div key={`opts-${q.id}`} className="flex flex-col gap-2.5 xs:gap-3 animate-slide-in">
                    {q.options.map((opt, idx) => {
                        const selected = answers[q.id] === idx
                        return (
                            <button
                                key={idx}
                                onClick={() => selectAnswer(q.id, idx)}
                                className={`w-full text-left px-3.5 xs:px-4 py-3 xs:py-3.5 rounded-xl xs:rounded-2xl border text-xs xs:text-sm font-semibold transition-all cursor-pointer active:scale-[0.98] ${selected
                                    ? 'border-red-600 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-800 hover:-translate-y-0.5'
                                    }`}
                            >
                                {opt}
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center gap-2.5 xs:gap-3 mt-7 xs:mt-8">
                    <button
                        onClick={goPrev}
                        disabled={current === 0}
                        className="flex-1 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs xs:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                    >
                        {t('levelTest.prevBtn') || 'Orqaga'}
                    </button>

                    {current < QUESTIONS.length - 1 ? (
                        <button
                            onClick={goNext}
                            className="flex-1 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs xs:text-sm transition-all cursor-pointer active:scale-95 hover:opacity-90"
                        >
                            {t('levelTest.nextBtn') || 'Keyingisi'}
                        </button>
                    ) : (
                        <button
                            onClick={manualFinish}
                            className="flex-1 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs xs:text-sm shadow-lg shadow-red-500/20 transition-all cursor-pointer active:scale-95"
                        >
                            {t('levelTest.finishBtn') || 'Testni yakunlash'}
                        </button>
                    )}
                </div>

                {current < QUESTIONS.length - 1 && (
                    <button
                        onClick={manualFinish}
                        className="w-full mt-3 text-[11px] xs:text-xs font-bold text-gray-400 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                        {t('levelTest.finishEarlyBtn') || "Testni oldindan yakunlash"}
                    </button>
                )}
            </div>
            <style>{styleBlock}</style>
        </div>
    )
}

const styleBlock = `
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
    @keyframes pulse-slow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }
    .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
    @keyframes scale-in {
        from { opacity: 0; transform: scale(0.7); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes slide-in {
        from { opacity: 0; transform: translateX(12px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in { animation: slide-in 0.35s ease-out; }
`