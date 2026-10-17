import React, { useState, useMemo, useEffect, useRef, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BsStars, BsCheck2Circle } from 'react-icons/bs'
import {
    FaChartLine,
    FaUserGraduate,
    FaAward,
    FaLaptopCode,
    FaMicrophoneAlt,
    FaPenNib,
    FaHeadphones,
    FaBookOpen,
    FaChevronDown
} from 'react-icons/fa'

/* ═══════════════════════════════════════════════════════════════
   ✏️  QO'LDA TAHRIRLASH UCHUN MA'LUMOTLAR
   Quyidagi obyektlardagi raqam va matnlarni xohlaganingizcha
   o'zgartiring — dizayn avtomatik moslashadi.
   ═══════════════════════════════════════════════════════════════ */

const COHORT_ORDER = ['a2', 'b1', 'b2']
const STAGE_ORDER = ['0m', '1m', '3m', 'end']
const STAGE_SHORT = { '0m': 'Kirish', '1m': '1-Oy', '3m': '3-Oy', end: 'Yakuniy' }

const COHORTS = {
    a2: {
        name: 'Foundation',
        range: 'A2 → B2+',
        students: 520,
        kpi: {
            finalBand: '6.5',
            gain: '+2.0 Band',
            successRate: '92.4%',
            fluency: '2.8x',
            mocks: '6,200+'
        },
        selfStudyEnd: 5.5,
        stages: {
            '0m': { label: 'Kirish', band: 4.5, speaking: '8 min', vocab: '600', accuracy: '42%', errors: 'Yuqori', skills: { listening: 4.5, reading: 4.5, speaking: 4.0, writing: 4.5 } },
            '1m': { label: '1-oy', band: 5.5, speaking: '20 min', vocab: '1,250', accuracy: '64%', errors: '-30%', skills: { listening: 5.5, reading: 5.5, speaking: 5.0, writing: 5.0 } },
            '3m': { label: '3-oy', band: 6.0, speaking: '40 min', vocab: '2,100', accuracy: '78%', errors: '-60%', skills: { listening: 6.5, reading: 6.0, speaking: 6.0, writing: 5.5 } },
            end: { label: 'Yakuniy', band: 6.5, plus: true, speaking: '65 min', vocab: '2,900+', accuracy: '89%', errors: '-85%', skills: { listening: 7.0, reading: 6.5, speaking: 6.5, writing: 6.0 } }
        },
        histogram: [
            { band: '5.5', pct: 12 },
            { band: '6.0', pct: 28 },
            { band: '6.5', pct: 42, active: true },
            { band: '7.0', pct: 14 },
            { band: '7.5+', pct: 4 }
        ]
    },
    b1: {
        name: 'Standard',
        range: 'B1 → C1',
        students: 680,
        kpi: {
            finalBand: '7.5',
            gain: '+2.0 Band',
            successRate: '95.2%',
            fluency: '3.2x',
            mocks: '8,400+'
        },
        selfStudyEnd: 6.0,
        stages: {
            '0m': { label: 'Kirish', band: 5.5, speaking: '12 min', vocab: '1,100', accuracy: '54%', errors: "O'rtacha", skills: { listening: 5.5, reading: 5.5, speaking: 5.0, writing: 5.0 } },
            '1m': { label: '1-oy', band: 6.5, speaking: '25 min', vocab: '1,850', accuracy: '72%', errors: '-30%', skills: { listening: 6.5, reading: 6.5, speaking: 6.0, writing: 6.0 } },
            '3m': { label: '3-oy', band: 7.0, speaking: '45 min', vocab: '2,650', accuracy: '84%', errors: '-60%', skills: { listening: 7.5, reading: 7.0, speaking: 7.0, writing: 6.5 } },
            end: { label: 'Yakuniy', band: 7.5, plus: true, speaking: '80 min', vocab: '3,500+', accuracy: '94%', errors: '-85%', skills: { listening: 8.5, reading: 8.0, speaking: 7.5, writing: 7.0 } }
        },
        histogram: [
            { band: '6.0', pct: 6 },
            { band: '6.5', pct: 14 },
            { band: '7.0', pct: 28 },
            { band: '7.5', pct: 36, active: true },
            { band: '8.0+', pct: 16, active: true }
        ]
    },
    b2: {
        name: 'Pro',
        range: 'B2 → C2',
        students: 350,
        kpi: {
            finalBand: '8.0',
            gain: '+1.5 Band',
            successRate: '97.8%',
            fluency: '3.8x',
            mocks: '4,800+'
        },
        selfStudyEnd: 6.5,
        stages: {
            '0m': { label: 'Kirish', band: 6.5, speaking: '22 min', vocab: '2,200', accuracy: '68%', errors: 'Murakkab', skills: { listening: 6.5, reading: 6.5, speaking: 6.0, writing: 6.0 } },
            '1m': { label: '1-oy', band: 7.0, speaking: '40 min', vocab: '3,000', accuracy: '82%', errors: '-45%', skills: { listening: 7.5, reading: 7.5, speaking: 7.0, writing: 6.5 } },
            '3m': { label: '3-oy', band: 7.5, speaking: '65 min', vocab: '3,900', accuracy: '91%', errors: '-75%', skills: { listening: 8.0, reading: 8.0, speaking: 7.5, writing: 7.0 } },
            end: { label: 'Yakuniy', band: 8.0, plus: true, speaking: '95 min', vocab: '4,800+', accuracy: '97%', errors: '-92%', skills: { listening: 9.0, reading: 8.5, speaking: 8.0, writing: 7.5 } }
        },
        histogram: [
            { band: '6.5', pct: 4 },
            { band: '7.0', pct: 15 },
            { band: '7.5', pct: 33 },
            { band: '8.0', pct: 35, active: true },
            { band: '8.5+', pct: 13, active: true }
        ]
    }
}

const COURSES = [
    {
        name: 'IELTS Writing AI Feedback',
        progress: 96,
        students: '500+',
        gain: '+1.5 Band',
        hours: '48 soat amaliyot',
        desc: 'Task 1 va Task 2 insholarini 4 ta rasmiy mezon bo‘yicha soniyalar ichida tahlil qilish.'
    },
    {
        name: 'IELTS Intensive & CDI Mock',
        progress: 94,
        students: '450+',
        gain: '+2.0 Band',
        hours: '72 soat + 12 Mock',
        desc: 'Haqiqiy IDP kompyuter interfeysida imtihon topshirish va xatolarni individual tahlil qilish.'
    },
    {
        name: 'Speaking Club with Native Mentors',
        progress: 91,
        students: '280+',
        gain: '+1.8 Band',
        hours: '36 soat jonli suhbat',
        desc: 'C1/C2 darajadagi idiomalar, talaffuz va Part 2/3 savollariga tezkor javob berish.'
    },
    {
        name: 'General English & Foundations',
        progress: 88,
        students: '320+',
        gain: '+1.5 Level',
        hours: '64 soat baza',
        desc: 'Akademik grammatika va mustahkam lug‘at boyligini noldan shakllantirish.'
    }
]

const SKILLS = [
    { key: 'listening', name: 'Listening', icon: FaHeadphones },
    { key: 'reading', name: 'Reading', icon: FaBookOpen },
    { key: 'speaking', name: 'Speaking', icon: FaMicrophoneAlt },
    { key: 'writing', name: 'Writing', icon: FaPenNib }
]

/* ═══════════════════════════════════════════════════════════════
   Yordamchi qismlar (tegmasangiz ham bo'ladi)
   ═══════════════════════════════════════════════════════════════ */

const CARD =
    'rounded-3xl bg-white dark:bg-[#0a0f1c] border border-slate-200/80 dark:border-white/[0.07] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] dark:shadow-none'

const EYEBROW =
    'text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-600 dark:text-red-400'

const fmtBand = (s) => `${s.band.toFixed(1)}${s.plus ? '+' : ''}`

/* Ekranga kirganda silliq paydo bo'lish (bitta observer — yengil) */
const Reveal = memo(function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null)
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') {
            setShown(true)
            return
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true)
                    io.disconnect()
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={`rv ${shown ? 'is-in' : ''} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    )
})

/* Egri chiziqli diagramma (SVG, faqat transform/opacity animatsiya) */
const W = 640
const H = 250
const PAD = { l: 40, r: 28, t: 34, b: 44 }

const GrowthChart = memo(function GrowthChart({ cohort, cohortKey, activeStage, onSelect }) {
    const geo = useMemo(() => {
        const bands = STAGE_ORDER.map((k) => cohort.stages[k].band)
        const lo = Math.floor(Math.min(...bands, cohort.selfStudyEnd) - 0.5)
        const hi = Math.ceil(Math.max(...bands) + 0.5)
        const innerW = W - PAD.l - PAD.r
        const innerH = H - PAD.t - PAD.b
        const x = (i) => PAD.l + (innerW / (STAGE_ORDER.length - 1)) * i
        const y = (b) => PAD.t + innerH - ((b - lo) / (hi - lo)) * innerH

        const pts = STAGE_ORDER.map((k, i) => ({ key: k, x: x(i), y: y(cohort.stages[k].band) }))

        const smooth = (arr) =>
            arr.reduce((d, p, i) => {
                if (i === 0) return `M ${p.x} ${p.y}`
                const prev = arr[i - 1]
                const mx = (prev.x + p.x) / 2
                return `${d} C ${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`
            }, '')

        const line = smooth(pts)
        const area = `${line} L ${pts[pts.length - 1].x} ${PAD.t + innerH} L ${pts[0].x} ${PAD.t + innerH} Z`
        const selfPts = [
            { x: pts[0].x, y: pts[0].y },
            { x: pts[pts.length - 1].x, y: y(cohort.selfStudyEnd) }
        ]
        const self = `M ${selfPts[0].x} ${selfPts[0].y} L ${selfPts[1].x} ${selfPts[1].y}`

        const grid = []
        for (let b = lo; b <= hi; b += 1) grid.push({ b, y: y(b) })

        return { pts, line, area, self, grid, selfEnd: selfPts[1], baseY: PAD.t + innerH }
    }, [cohort])

    const active = geo.pts.find((p) => p.key === activeStage) || geo.pts[0]

    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[460px]" role="img" aria-label="IELTS o‘sish grafigi">
                <defs>
                    <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FB7185" />
                        <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                </defs>

                {geo.grid.map((g) => (
                    <g key={g.b}>
                        <line x1={PAD.l} x2={W - PAD.r} y1={g.y} y2={g.y} stroke="currentColor" className="text-slate-200 dark:text-white/[0.06]" />
                        <text x={PAD.l - 10} y={g.y + 3.5} textAnchor="end" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>
                            {g.b.toFixed(1)}
                        </text>
                    </g>
                ))}

                {/* key o'zgarganda chizilish animatsiyasi qayta ishlaydi */}
                <g key={cohortKey}>
                    <path d={geo.self} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" className="text-slate-300 dark:text-slate-600 fade-in" />
                    <text x={geo.selfEnd.x} y={geo.selfEnd.y + 18} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 fade-in" style={{ fontSize: 10, fontWeight: 700 }}>
                        Mustaqil: {cohort.selfStudyEnd.toFixed(1)}
                    </text>
                    <path d={geo.area} fill="url(#gArea)" className="fade-in" />
                    <path d={geo.line} pathLength="1" fill="none" stroke="url(#gLine)" strokeWidth="3.5" strokeLinecap="round" className="draw-line" />
                </g>

                {/* tanlangan nuqta bo'ylab vertikal chiziq */}
                <g className="marker" style={{ transform: `translate(${active.x}px, 0px)` }}>
                    <line x1="0" x2="0" y1={PAD.t - 6} y2={geo.baseY} stroke="#DC2626" strokeOpacity="0.35" strokeDasharray="3 4" />
                </g>

                {geo.pts.map((p) => {
                    const sel = p.key === activeStage
                    return (
                        <g key={p.key} onClick={() => onSelect(p.key)} className="cursor-pointer">
                            <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={sel ? 7.5 : 5.5}
                                strokeWidth={sel ? 3.5 : 2.5}
                                stroke="#DC2626"
                                className="fill-white dark:fill-[#0a0f1c] dot"
                            />
                            <text
                                x={p.x}
                                y={H - 14}
                                textAnchor="middle"
                                className={sel ? 'fill-red-600 dark:fill-red-400' : 'fill-slate-500 dark:fill-slate-400'}
                                style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                            >
                                {STAGE_SHORT[p.key]}
                            </text>
                            <text
                                x={p.x}
                                y={p.y - 16}
                                textAnchor="middle"
                                className={sel ? 'fill-red-600 dark:fill-red-400' : 'fill-slate-700 dark:fill-slate-300'}
                                style={{ fontSize: 12, fontWeight: 900 }}
                            >
                                {fmtBand(cohort.stages[p.key])}
                            </text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
})

/* ═══════════════════════════════════════════════════════════════
   ASOSIY KOMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Stats() {
    const { t } = useTranslation()

    const [cohortKey, setCohortKey] = useState('b1')
    const [stageKey, setStageKey] = useState('end')
    const [openCourse, setOpenCourse] = useState(0)

    const cohort = COHORTS[cohortKey]
    const stage = cohort.stages[stageKey]
    const start = cohort.stages['0m']
    const cohortIdx = COHORT_ORDER.indexOf(cohortKey)
    const maxHist = useMemo(() => Math.max(...cohort.histogram.map((h) => h.pct)), [cohort])

    const kpis = [
        { icon: FaAward, label: "O'rtacha yakuniy natija", val: cohort.kpi.finalBand, unit: 'BAND', chip: cohort.kpi.gain },
        { icon: FaChartLine, label: 'Maqsadga erishish', val: cohort.kpi.successRate, unit: 'TASDIQLANGAN', chip: 'IDP / BC' },
        { icon: FaUserGraduate, label: 'Nutq ravonligi', val: cohort.kpi.fluency, unit: 'TEZLASHUV', chip: stage.speaking },
        { icon: FaLaptopCode, label: 'Topshirilgan CDI mocklar', val: cohort.kpi.mocks, unit: 'TAHLIL', chip: `Aniqlik ${stage.accuracy}` }
    ]

    const stageTiles = [
        { label: 'IELTS Band', value: fmtBand(stage) },
        { label: 'Speaking', value: stage.speaking },
        { label: "Lug'at", value: stage.vocab },
        { label: 'Aniqlik', value: stage.accuracy }
    ]

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 text-slate-900 dark:text-white">
            <style>{`
                .rv{opacity:0;transform:translate3d(0,18px,0);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);will-change:opacity,transform}
                .rv.is-in{opacity:1;transform:none;will-change:auto}
                .swap{animation:swapIn .45s cubic-bezier(.22,1,.36,1) both}
                @keyframes swapIn{from{opacity:0;transform:translate3d(0,6px,0)}to{opacity:1;transform:none}}
                .fade-in{animation:fadeIn .8s ease both}
                @keyframes fadeIn{from{opacity:0}to{opacity:1}}
                .draw-line{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.3s cubic-bezier(.22,1,.36,1) .1s forwards}
                @keyframes draw{to{stroke-dashoffset:0}}
                .marker{transition:transform .6s cubic-bezier(.22,1,.36,1)}
                .dot{transition:r .35s cubic-bezier(.22,1,.36,1),stroke-width .35s}
                .grow-x{transform-origin:left center;transition:transform .8s cubic-bezier(.22,1,.36,1)}
                .grow-y{transform-origin:center bottom;transition:transform .8s cubic-bezier(.22,1,.36,1)}
                .pill{transition:transform .45s cubic-bezier(.22,1,.36,1)}
                .acc{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.22,1,.36,1)}
                .acc.open{grid-template-rows:1fr}
                .no-scrollbar{scrollbar-width:none}
                .no-scrollbar::-webkit-scrollbar{display:none}
                .glow{background:radial-gradient(closest-side,rgba(220,38,38,.10),transparent);}
                @media (prefers-reduced-motion:reduce){
                    .rv{opacity:1;transform:none;transition:none}
                    .swap,.fade-in{animation:none}
                    .draw-line{animation:none;stroke-dashoffset:0}
                    .marker,.dot,.grow-x,.grow-y,.pill,.acc{transition:none}
                }
            `}</style>

            {/* Fon nuri — blur o'rniga yengil gradient (telefonni qotirmaydi) */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] flex justify-center overflow-hidden">
                <div className="glow w-[900px] max-w-full h-full" />
            </div>

            {/* ── HEADER ── */}
            <Reveal>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                            {t('statistic.badge', "O'QUVCHILAR DINAMIKASI")} · N = {cohort.students}
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] font-heading">
                            {t('statistic.title', "Haqiqiy tahlil va o'sish grafigi")}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base max-w-xl">
                            {t('statistic.description', 'Boshlang‘ich darajangizni tanlang va bosqichlar ustiga bosib, o‘zgarishlarni ko‘ring.')}
                        </p>
                    </div>

                    {/* Daraja tanlagich — sirpanuvchi pill */}
                    <div className="w-full lg:w-auto">
                        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-2">
                            Boshlang‘ich daraja
                        </div>
                        <div className="relative grid grid-cols-3 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/[0.07]">
                            <div
                                aria-hidden
                                className="pill absolute top-1 bottom-1 left-1 rounded-xl bg-red-600 shadow-md shadow-red-600/25"
                                style={{ width: 'calc((100% - 8px) / 3)', transform: `translateX(${cohortIdx * 100}%)` }}
                            />
                            {COHORT_ORDER.map((k) => {
                                const on = k === cohortKey
                                return (
                                    <button
                                        key={k}
                                        onClick={() => setCohortKey(k)}
                                        className={`relative z-10 px-3 sm:px-5 py-2 text-center transition-colors duration-300 cursor-pointer ${
                                            on ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <span className="block text-xs font-extrabold">{COHORTS[k].name}</span>
                                        <span className={`block text-[10px] font-mono font-bold ${on ? 'text-red-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {COHORTS[k].range}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* ── KPI ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {kpis.map((k, i) => {
                    const Icon = k.icon
                    return (
                        <Reveal key={k.label} delay={i * 70}>
                            <div className={`${CARD} p-4 sm:p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 leading-snug">
                                        {k.label}
                                    </span>
                                    <span className="shrink-0 w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                                        <Icon className="text-[11px]" />
                                    </span>
                                </div>
                                <div key={cohortKey + k.val} className="swap flex items-baseline gap-1.5 flex-wrap">
                                    <span className="text-2xl sm:text-4xl font-black tracking-tight font-mono">{k.val}</span>
                                    <span className="text-[9px] sm:text-[10px] font-extrabold text-red-600 dark:text-red-400 tracking-wider">{k.unit}</span>
                                </div>
                                <div className="mt-3 inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400">
                                    {k.chip}
                                </div>
                            </div>
                        </Reveal>
                    )
                })}
            </div>

            {/* ── ASOSIY GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* CHAP */}
                <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
                    <Reveal>
                        <div className={`${CARD} overflow-hidden`}>
                            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className={EYEBROW}>{t('statistic.dynamicsTitle', 'BOSQICHMA-BOSQICH TAHLIL')}</span>
                                    <h3 className="text-lg sm:text-xl font-black mt-1 font-heading">
                                        {t('statistic.analysisTitle', 'IELTS ball o‘sishi')}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05]">
                                    {STAGE_ORDER.map((k) => (
                                        <button
                                            key={k}
                                            onClick={() => setStageKey(k)}
                                            className={`px-2 py-1.5 rounded-lg text-[11px] font-extrabold transition-all duration-300 cursor-pointer ${
                                                stageKey === k
                                                    ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm'
                                                    : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                        >
                                            {STAGE_SHORT[k]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-3 sm:px-6 pb-2">
                                <GrowthChart cohort={cohort} cohortKey={cohortKey} activeStage={stageKey} onSelect={setStageKey} />
                            </div>

                            {/* Tanlangan bosqich tafsilotlari */}
                            <div key={cohortKey + stageKey} className="swap grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200/70 dark:border-white/[0.06]">
                                {stageTiles.map((tile, i) => (
                                    <div
                                        key={tile.label}
                                        className={`p-4 sm:p-5 ${i % 2 === 1 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-t-0' : ''} ${
                                            i > 0 ? 'sm:border-l' : ''
                                        } border-slate-200/70 dark:border-white/[0.06]`}
                                    >
                                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">{tile.label}</div>
                                        <div className="text-xl sm:text-2xl font-black font-mono mt-1">{tile.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-5 sm:px-6 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-white/[0.06] flex items-center gap-2">
                                <BsCheck2Circle className="text-red-600 dark:text-red-400 shrink-0" />
                                <span>
                                    {stage.label}: xatolar {stage.errors} · Boshlang‘ich {fmtBand(start)} → {fmtBand(stage)}
                                </span>
                            </div>
                        </div>
                    </Reveal>

                    {/* Gistogramma */}
                    <Reveal>
                        <div className={`${CARD} p-5 sm:p-6`}>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 block">
                                        KOHORTA TAQSIMOTI
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black font-heading mt-1">Bitiruvchilar IELTS ballari ulushi</h3>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-slate-400">N = {cohort.students}</span>
                            </div>

                            <div className="grid grid-cols-5 gap-2 sm:gap-4 h-40 items-end">
                                {cohort.histogram.map((bar) => (
                                    <div key={bar.band} className="h-full flex flex-col justify-end items-center gap-1.5">
                                        <span className="text-[11px] font-mono font-black text-slate-700 dark:text-slate-200">{bar.pct}%</span>
                                        <div className="w-full flex-1 min-h-0 flex items-end">
                                            <div
                                                className={`grow-y w-full h-full rounded-t-xl ${
                                                    bar.active ? 'bg-gradient-to-t from-red-700 to-red-500' : 'bg-slate-200 dark:bg-white/10'
                                                }`}
                                                style={{ transform: `scaleY(${Math.max(0.08, bar.pct / maxHist)})` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono font-extrabold text-slate-500 dark:text-slate-400">{bar.band}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* O'NG */}
                <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
                    {/* Ko'nikmalar */}
                    <Reveal>
                        <div className={`${CARD} p-5 sm:p-6`}>
                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div>
                                    <span className={EYEBROW}>4-SKILL DIAGNOSTIKA</span>
                                    <h3 className="text-base sm:text-lg font-black font-heading mt-1">Ko‘nikmalar balansi</h3>
                                </div>
                                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                                    Band {fmtBand(stage)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {SKILLS.map((sk) => {
                                    const Icon = sk.icon
                                    const s0 = start.skills[sk.key]
                                    const cur = stage.skills[sk.key]
                                    return (
                                        <div key={sk.key}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                                                    <Icon className="text-red-600 dark:text-red-400 text-xs" />
                                                    {sk.name}
                                                </div>
                                                <div className="flex items-center gap-2 font-mono">
                                                    <span className="text-xs font-black">{cur.toFixed(1)}</span>
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        +{(cur - s0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative h-2 rounded-full bg-slate-100 dark:bg-white/[0.07] overflow-hidden">
                                                <div
                                                    className="grow-x absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-700"
                                                    style={{ transform: `scaleX(${cur / 9})` }}
                                                />
                                                <div
                                                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400/70 dark:bg-white/50"
                                                    style={{ left: `${(s0 / 9) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="mt-4 text-[10px] font-mono text-slate-400 dark:text-slate-500">| — kirish darajasi ({fmtBand(start)})</p>
                        </div>
                    </Reveal>

                    {/* Kurslar */}
                    <Reveal className="flex-1">
                        <div className={`${CARD} p-5 sm:p-6 h-full flex flex-col`}>
                            <div className="mb-4">
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 block">
                                    {t('statistic.courseTypeTitle', 'DARS TAQSIMOTI')}
                                </span>
                                <h3 className="text-base sm:text-lg font-black font-heading mt-1">
                                    {t('statistic.coursesTitle', 'Kurslar samaradorligi')}
                                </h3>
                            </div>

                            <div className="space-y-2.5 flex-1">
                                {COURSES.map((c, i) => {
                                    const open = openCourse === i
                                    return (
                                        <div
                                            key={c.name}
                                            className={`rounded-2xl border transition-colors duration-300 ${
                                                open
                                                    ? 'bg-slate-50 dark:bg-white/[0.04] border-red-500/40'
                                                    : 'border-slate-200/70 dark:border-white/[0.07]'
                                            }`}
                                        >
                                            <button
                                                onClick={() => setOpenCourse(open ? -1 : i)}
                                                aria-expanded={open}
                                                className="w-full text-left p-3.5 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-2 text-xs">
                                                    <span className="font-extrabold">{c.name}</span>
                                                    <span className="flex items-center gap-2 font-mono shrink-0">
                                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{c.gain}</span>
                                                        <span className="font-black text-red-600 dark:text-red-400">{c.progress}%</span>
                                                        <FaChevronDown
                                                            className={`text-[10px] text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                                        />
                                                    </span>
                                                </div>
                                                <div className="mt-2.5 h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
                                                    <div
                                                        className="grow-x h-full rounded-full bg-red-600"
                                                        style={{ transform: `scaleX(${c.progress / 100})` }}
                                                    />
                                                </div>
                                            </button>
                                            <div className={`acc ${open ? 'open' : ''}`}>
                                                <div className="overflow-hidden">
                                                    <div className="px-3.5 pb-3.5 text-[11px] text-slate-600 dark:text-slate-400 space-y-2">
                                                        <p>{c.desc}</p>
                                                        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                                                            <span>Faol: {c.students} o‘quvchi</span>
                                                            <span>{c.hours}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <BsStars className="text-red-600 dark:text-red-400 shrink-0" />
                                <span>Har oy CDI testlari orqali natijalar yangilanadi</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}