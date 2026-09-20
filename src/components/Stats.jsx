import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'

export default function Stats() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('1m');

    const dataConfig = {
        '1m': {
            label: t('statistic.tab1'),
            speaking: '25 min',
            errors: t('statistic.tab1Errors'),
            trendText: t('statistic.tab1Trend'),
            pathD: 'M 0 130 Q 100 120, 200 100 T 400 70',
            gradD: 'M 0 130 Q 100 120, 200 100 T 400 70 L 400 150 L 0 150 Z',
            circleX: 200,
            circleY: 100
        },
        '3m': {
            label: t('statistic.tab3'),
            speaking: '45 min',
            errors: t('statistic.tab3Errors'),
            trendText: t('statistic.tab3Trend'),
            pathD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40',
            gradD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40 L 400 150 L 0 150 Z',
            circleX: 320,
            circleY: 30
        },
        'end': {
            label: t('statistic.tabEnd'),
            speaking: '80 min',
            errors: t('statistic.endErrors'),
            trendText: t('statistic.endTrend'),
            pathD: 'M 0 130 Q 100 90, 220 50 T 400 10',
            gradD: 'M 0 130 Q 100 90, 220 50 T 400 10 L 400 150 L 0 150 Z',
            circleX: 400,
            circleY: 10
        }
    };

    const current = dataConfig[activeTab];

    return (
        <div className="container-site pt-[130px] pb-20 sm:pb-24 select-none">

            {/* Sarlavha */}
            <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6 pb-10 border-b border-line">
                <div className="max-w-xl">
                    <span className="eyebrow">{t('statistic.badge')}</span>
                    <h1 className="display-2 mt-5 text-ink">
                        {t('statistic.title')}
                    </h1>
                </div>
                <p className="lede max-w-sm md:text-right !text-[14.5px]">
                    {t('statistic.description')}
                </p>
            </div>

            {/* Asosiy grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

                {/* Chap: Grafik */}
                <div data-reveal className="card !rounded-[20px] p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">

                    <div>
                        <div className="flex flex-col gap-5 mb-6">
                            <div className="flex flex-col">
                                <span className="meta-label">{t('statistic.dynamicsTitle')}</span>
                                <h2 className="font-display text-[24px] sm:text-[28px] font-semibold text-ink mt-1">{t('statistic.analysisTitle')}</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-1 bg-surface2 p-1 rounded-full border border-line w-full">
                                {Object.keys(dataConfig).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`py-2 px-1 text-[11.5px] font-bold rounded-full transition-all duration-300 cursor-pointer truncate text-center ${activeTab === key ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-ink'}`}
                                    >
                                        {dataConfig[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-48 sm:h-56 bg-raised rounded-[16px] p-3 sm:p-4 flex items-end relative border border-line mb-6 overflow-hidden">
                            <svg className="w-full h-full transition-all duration-700 ease-in-out" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d={current.gradD} fill="url(#largeChartGrad)" className="transition-all duration-700 ease-in-out" />
                                <path d={current.pathD} stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-all duration-700 ease-in-out" />
                                <circle cx={current.circleX} cy={current.circleY} r="5.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2.5" className="transition-all duration-700 ease-in-out" />
                            </svg>

                            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-ink text-bg text-[10.5px] font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[10px] shadow-[var(--shadow-soft)]">
                                {current.trendText}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-line pt-5 text-center">
                        {Object.keys(dataConfig).map((key) => {
                            const item = dataConfig[key];
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`p-3 sm:p-4 rounded-[14px] border transition-all duration-300 cursor-pointer text-center flex flex-col gap-1.5 ${isActive ? 'bg-accentsoft border-accent/30' : 'border-line hover:border-linestrong bg-transparent'}`}
                                >
                                    <span className={`text-[9.5px] sm:text-[11px] font-bold block uppercase tracking-[0.1em] truncate ${isActive ? 'text-accent' : 'text-muted'}`}>{item.label}</span>
                                    <span className="font-display text-[18px] sm:text-[22px] font-semibold text-ink block leading-none">{item.speaking}</span>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-muted block truncate">{item.errors}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* O'ng: Kurs turlari */}
                <div data-reveal="right" data-reveal-delay="120" className="card !rounded-[20px] p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between">

                    <div>
                        <span className="meta-label">{t('statistic.courseTypeTitle')}</span>
                        <h2 className="font-display text-[24px] sm:text-[28px] font-semibold text-ink mt-1 mb-7">{t('statistic.coursesTitle')}</h2>

                        <div className="space-y-5">
                            {[
                                { name: 'General English', progress: '84%', color: 'var(--accent)' },
                                { name: 'IELTS Preparation', progress: '76%', color: 'var(--ink)' },
                                { name: 'Speaking Club', progress: '92%', color: 'var(--accent)' },
                                { name: 'Grammar Intensive', progress: '68%', color: 'var(--line-strong)' }
                            ].map((course, index) => (
                                <div key={index} className="space-y-2 group">
                                    <div className="flex justify-between text-[12.5px] font-semibold">
                                        <span className="text-soft group-hover:text-accent transition-colors">{course.name}</span>
                                        <span className="text-ink tabular-nums">{course.progress} {t('statistic.studentsText')}</span>
                                    </div>
                                    <div className="w-full h-[5px] bg-surface2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: course.progress, background: course.color }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full mt-8 py-3.5 bg-accentsoft text-accent font-semibold rounded-[14px] border border-accent/20 text-[12.5px] flex items-center justify-center gap-2">
                        <BsStars className="text-[15px]" />
                        <span>{t('statistic.footerText').replace('✨', '').trim()}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
