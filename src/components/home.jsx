import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCompass, FaBookOpen } from 'react-icons/fa';
import CourseFinderModal from './CourseFinderModal';
import DailyPracticeModal from './DailyPracticeModal';
import OptimumRibbon from './visual/OptimumRibbon';
import './home.css';

const TICKER_ITEMS = [
    'OPTIMUM ELC',
    'CAMBRIDGE',
    'CDI SIMULATOR',
    'IELTS 7.5+',
    'AI ESSAY FEEDBACK',
    'BUKHARA',
];

export default function Home() {
    const { t } = useTranslation();
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);
    const rootRef = useRef(null);

    // Pause CSS animations while the section is off-screen
    useEffect(() => {
        const el = rootRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return undefined;
        const io = new IntersectionObserver(
            ([entry]) => el.classList.toggle('ox-paused', !entry.isIntersecting),
            { threshold: 0 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const stats = [
        { value: '8.0', sup: '+', label: t('home.stats.mentors', "Mentor darajasi") },
        { value: '100', sup: '%', label: t('home.stats.cdi', 'CDI simulyatsiyasi') },
        { value: '7.5', sup: '+', label: t('home.stats.ielts', 'IELTS maqsad bali') },
        { value: '4', sup: '', label: t('home.stats.criteria', 'Esse baholash mezoni') },
    ];

    return (
        <div ref={rootRef} className="ox-home">

            {/* ═══════════════════════════════════════
                HERO
            ═══════════════════════════════════════ */}
            <section className="ox-hero" aria-labelledby="ox-hero-title">
                <div className="ox-hero__inner">

                    {/* ── Copy column ── */}
                    <div className="ox-hero__copy">

                        {/* Eyebrow */}
                        <p className="ox-eyebrow" aria-hidden="true">
                            <span className="ox-eyebrow__dot" />
                            {t('home.eyebrow', 'Optimum School of English')}
                            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>
                                39°46′N 64°25′E · Bukhara
                            </span>
                        </p>

                        {/* Oversized headline */}
                        <h1 id="ox-hero-title" className="ox-headline">
                            <span className="ox-headline__white">
                                {t('home.hero.line1', 'Your potential.')}
                            </span>
                            <span className="ox-headline__red">
                                {t('home.hero.line2', 'Without limits.')}
                            </span>
                        </h1>

                        {/* Attribute badges */}
                        <div className="ox-hero__badges">
                            <span className="ox-badge ox-badge--red">Cambridge</span>
                            <span className="ox-badge ox-badge--red">IELTS 7.5+</span>
                            <span className="ox-badge">CDI Lab</span>
                            <span className="ox-badge">AI Essay</span>
                        </div>

                        {/* Supporting copy */}
                        <p className="ox-lead">
                            {t(
                                'home.description',
                                "Optimum — xalqaro Cambridge ta'lim standartlari, rasmiy CDI imtihon simulyatori va sun'iy intellekt orqali IELTS 7.5+ natijalarini kafolatlovchi zamonaviy ta'lim ekotizimi."
                            )}
                        </p>

                        {/* Primary CTAs */}
                        <div className="ox-actions">
                            <Link to="/form" className="ox-cta-primary">
                                {t('home.enrollBtn', "O'qishni boshlash")}
                                <FaArrowRight aria-hidden="true" />
                            </Link>

                            <button
                                type="button"
                                className="ox-cta-btn"
                                onClick={() => setIsFinderOpen(true)}
                            >
                                <FaCompass aria-hidden="true" />
                                {t('home.findCourseBtn', 'Kurs tanlash')}
                            </button>

                            <button
                                type="button"
                                className="ox-cta-btn"
                                onClick={() => setIsPracticeOpen(true)}
                                title="Kun so'zi va lug'at amaliyoti"
                            >
                                <FaBookOpen aria-hidden="true" />
                                {t('home.dailyWordBtn', "Kun so'zi")}
                            </button>
                        </div>

                        {/* Technical coordinate annotation */}
                        <div className="ox-coord">
                            <span className="ox-coord__item">LEARN</span>
                            <span className="ox-coord__sep" />
                            <span className="ox-coord__item">GROW</span>
                            <span className="ox-coord__sep" />
                            <span className="ox-coord__item">ACHIEVE</span>
                        </div>
                    </div>

                    {/* ── Artwork column ── */}
                    <div className="ox-hero__art" aria-hidden="true">
                        <OptimumRibbon id="hero" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                DIAGONAL EDITORIAL TICKER
            ═══════════════════════════════════════ */}
            <div className="ox-ticker" aria-hidden="true">
                <div className="ox-ticker__track">
                    {[0, 1].map((dup) => (
                        <div className="ox-ticker__group" key={dup}>
                            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((word, i) => (
                                <span key={`${dup}-${i}`} className="ox-ticker__item">
                                    {word}
                                    <i className="ox-ticker__dot" />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════
                ABOUT / STATS SECTION
            ═══════════════════════════════════════ */}
            <section className="ox-about" aria-labelledby="ox-about-title">
                <div className="ox-about__inner">
                    <div className="ox-about__content">
                        <p className="ox-about__label">
                            <span className="ox-about__label-dot" />
                            {t('home.about.label', 'Nima uchun Optimum')}
                        </p>

                        <div className="ox-about__grid">
                            <h2 id="ox-about-title" className="ox-about__title">
                                {t('home.about.title', 'Cambridge standartlari. Haqiqiy imtihon muhiti.')}
                            </h2>

                            <p className="ox-about__text">
                                {t(
                                    'home.about.text',
                                    "Rasmiy CDI simulyatori, sun'iy intellekt asosidagi esse tahlili va kundalik lug'at amaliyoti bir joyda — tayyorgarlikni imtihon formatida olib boring."
                                )}
                            </p>
                        </div>

                        <dl className="ox-stats">
                            {stats.map((s) => (
                                <div className="ox-stat" key={s.label}>
                                    <dt>{s.label}</dt>
                                    <dd>
                                        {s.value}
                                        {s.sup && <span>{s.sup}</span>}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <CourseFinderModal isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} />
            <DailyPracticeModal isOpen={isPracticeOpen} onClose={() => setIsPracticeOpen(false)} />
        </div>
    );
}