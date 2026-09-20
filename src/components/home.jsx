import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import useParallax from '../hooks/useParallax'

const EASE = [0.22, 1, 0.36, 1]

/* Haqiqiy o'quvchi natijasi (ResultsSlider dagi ma'lumot): Javohir — Overall 7.5 */
const MODULES = [
    { key: 'listening', label: 'Listening', band: '9.0', pct: 1.0 },
    { key: 'reading', label: 'Reading', band: '7.5', pct: 0.83 },
    { key: 'writing', label: 'Writing', band: '6.5', pct: 0.72 },
    { key: 'speaking', label: 'Speaking', band: '6.5', pct: 0.72 },
]

const TRUST_AVATARS = [
    'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg',
    'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg',
    'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-06.jpg',
]

const scrollToResults = (e) => {
    e.preventDefault()
    const el = document.getElementById('results-section')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.pageYOffset - 20
    window.scrollTo({ top, behavior: 'smooth' })
}

export default function Home() {
    const { t } = useTranslation()

    // Kirish loader'i tugagach boshlanadigan animatsiya ketma-ketligi
    const introDelay = typeof document !== 'undefined'
        && document.documentElement.getAttribute('data-intro') === 'pending' ? 1.55 : 0.05

    const d = (extra) => introDelay + extra

    const visualParallax = useParallax({ strength: 26 })

    const stats = [
        { value: '5+', label: t('home.statYears', 'Yillik tajriba') },
        { value: '200+', label: t('home.statStudents', 'O‘quvchi') },
        { value: 'IELTS 8.0', label: t('home.statMentors', 'Sertifikatli mentor') },
        { value: '100+', label: t('home.statMocks', 'Mock testlar') },
    ]

    const headlineLines = [
        t('home.titlePrefix', 'Ingliz tilini noldan'),
        t('home.titleHighlight', 'mukammallikkacha o‘rganing'),
    ]

    return (
        <section className="relative w-full overflow-hidden">
            {/* Juda nozik fon aksenti — gradient emas, shunchaki issiq nur */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-[0.5] dark:opacity-[0.35]"
                style={{ background: 'radial-gradient(closest-side, var(--accent-soft), transparent)' }}
            />

            <div className="container-site relative">
                <div className="min-h-[calc(100svh-72px)] flex flex-col justify-center pt-[104px] pb-10 lg:pt-[120px]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1">

                        {/* ===== Chap — tahririy tarkib ===== */}
                        <div className="lg:col-span-7 relative z-10">
                            {/* 1 — Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: EASE, delay: d(0.1) }}
                            >
                                <span className="eyebrow">
                                    {t('home.badge', 'OPTIMUM SCHOOL OF ENGLISH')}
                                </span>
                            </motion.div>

                            {/* 2 — Sarlavha (qatorma-qator ochiladi) */}
                            <h1 className="display-1 mt-6 text-ink">
                                {headlineLines.map((line, i) => (
                                    <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                                        <motion.span
                                            className={`block ${i === 1 ? 'serif-accent' : ''}`}
                                            initial={{ y: '112%' }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 1.0, ease: EASE, delay: d(0.22 + i * 0.14) }}
                                        >
                                            {line}
                                        </motion.span>
                                    </span>
                                ))}
                            </h1>

                            {/* 3 — Tavsif */}
                            <motion.p
                                className="lede mt-6 max-w-[52ch]"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: EASE, delay: d(0.55) }}
                            >
                                {t('home.description', 'Optimum o‘quv platformasi barcha darajadagi o‘quvchilar uchun CDI simulatori va AI tahlillari orqali 7.5+ Band natijalarini ta’minlaydi.')}
                            </motion.p>

                            {/* 4 — CTAlar */}
                            <motion.div
                                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-9"
                                initial="hidden"
                                animate="show"
                                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: d(0.72) } } }}
                            >
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                                >
                                    <Link to="/form" className="btn btn-primary w-full sm:w-auto">
                                        {t('home.enrollBtn', 'Bepul darsga yozilish')}
                                        <FaArrowRight className="w-3.5 h-3.5 btn-arrow" />
                                    </Link>
                                </motion.div>
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                                >
                                    <Link to="/about" className="btn btn-outline w-full sm:w-auto">
                                        {t('home.moreInfoBtn', "Batafsil ma'lumot")}
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* 5 — Ishonch qatori */}
                            <motion.div
                                className="flex items-center gap-4 mt-10"
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: EASE, delay: d(0.95) }}
                            >
                                <div className="flex -space-x-2.5">
                                    {TRUST_AVATARS.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt=""
                                            loading="lazy"
                                            width={34}
                                            height={34}
                                            className="w-[34px] h-[34px] rounded-full object-cover object-[center_30%] ring-2 ring-[var(--bg)]"
                                        />
                                    ))}
                                </div>
                                <p className="text-[13px] text-muted">
                                    {t('home.trustText', 'O‘quvchilarimiz haqiqiy natijalari')}{' '}
                                    <a
                                        href="#results-section"
                                        onClick={scrollToResults}
                                        className="link-line !text-accent !font-semibold text-[13px]"
                                    >
                                        {t('home.trustCta', 'Natijalarni ko‘rish')}
                                        <FaArrowRight className="w-2.5 h-2.5 btn-arrow" />
                                    </a>
                                </p>
                            </motion.div>
                        </div>

                        {/* ===== O'ng — platforma kompozitsiyasi ===== */}
                        <div className="lg:col-span-5 relative z-10 mt-2 lg:mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0, ease: EASE, delay: d(0.5) }}
                                className="relative max-w-[440px] mx-auto lg:ml-auto lg:mr-0 w-full"
                            >
                                <div ref={visualParallax}>
                                    {/* Suzuvchi chip — AI Writing Examiner */}
                                    <div className="hidden lg:flex absolute -right-7 top-9 z-20 chip !rounded-full bg-raised shadow-[var(--shadow-lift)] animate-float-slow">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        AI Writing Examiner
                                    </div>
                                    {/* Suzuvchi chip — CDI */}
                                    <div className="hidden lg:flex absolute -left-9 bottom-12 z-20 chip !rounded-full bg-raised shadow-[var(--shadow-lift)] animate-float-slower">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        Real CDI Simulation
                                    </div>

                                    {/* Asosiy karta */}
                                    <div className="card !rounded-[20px] p-6 sm:p-7 relative overflow-hidden">
                                        {/* Karta sarlavhasi */}
                                        <div className="flex items-start justify-between gap-4 pb-5 border-b border-line">
                                            <div className="flex items-center gap-3.5">
                                                <img
                                                    src="/favicon.png"
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-line"
                                                />
                                                <div>
                                                    <p className="font-display text-[21px] font-semibold leading-none text-ink">
                                                        Optimum IELTS Hub
                                                    </p>
                                                    <p className="text-[11.5px] text-muted mt-1.5">
                                                        Full Exam Practice Suite
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="chip !py-1.5 !px-3 !text-[10px] !font-bold tracking-[0.08em] uppercase shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                CDI Engine
                                            </span>
                                        </div>

                                        {/* Modullar — band ko'rsatkichlari */}
                                        <div className="py-5 flex flex-col gap-[18px]">
                                            {MODULES.map((m, i) => (
                                                <div key={m.key} className="flex items-center gap-4">
                                                    <span className="w-[86px] shrink-0 text-[13px] font-semibold text-soft">
                                                        {m.label}
                                                    </span>
                                                    <div className="flex-1 h-[3px] rounded-full bg-surface2 overflow-hidden">
                                                        <motion.div
                                                            className="h-full w-full rounded-full bg-accent origin-left"
                                                            initial={{ scaleX: 0 }}
                                                            animate={{ scaleX: m.pct }}
                                                            transition={{ duration: 1.2, ease: EASE, delay: d(1.05 + i * 0.09) }}
                                                        />
                                                    </div>
                                                    <span className="font-display text-[22px] font-semibold text-ink w-[46px] text-right leading-none">
                                                        {m.band}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Umumiy natija */}
                                        <div className="flex items-center justify-between pt-5 border-t border-line">
                                            <div className="flex items-baseline gap-3">
                                                <span className="meta-label">{t('resultsSlider.overall', 'Overall')}</span>
                                                <span className="font-display text-[34px] font-semibold text-accent leading-none">
                                                    7.5
                                                </span>
                                            </div>
                                            <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-muted">
                                                <FaCheckCircle className="w-3 h-3 text-accent" />
                                                {t('home.resultBadge', 'Haqiqiy o‘quvchi natijasi')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ===== Statistika lentasi ===== */}
                    <div data-reveal className="mt-16 lg:mt-20 border-t border-line pt-7 grid grid-cols-2 md:grid-cols-4 gap-y-7">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`flex flex-col gap-1.5 ${i > 0 ? 'md:border-l md:border-line md:pl-7' : ''} ${i % 2 === 1 ? 'border-l border-line pl-6 md:pl-7' : ''}`}
                            >
                                <span className="font-display text-[30px] sm:text-[34px] font-semibold text-ink leading-none">
                                    {s.value}
                                </span>
                                <span className="text-[12.5px] font-medium text-muted">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
