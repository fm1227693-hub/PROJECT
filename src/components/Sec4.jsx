import { useTranslation } from 'react-i18next'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useParallax from '../hooks/useParallax'

export default function Sec4() {
    const { t } = useTranslation()
    const imageParallax = useParallax({ strength: 30 })

    return (
        <section className="section-pad !pt-0 select-none">
            <div className="container-site">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Chap — matn */}
                    <div className="lg:col-span-6 flex flex-col gap-7">
                        <div data-reveal>
                            <span className="eyebrow">{t('about.badge', 'Biz haqimizda')}</span>
                            <h2 className="display-2 mt-5 text-ink">
                                {t('about.titleStart', 'Ingliz tilini zamonaviy va ')}
                                <span className="serif-accent">{t('about.titleHighlight', 'oson usullarda')}</span>
                                {t('about.titleEnd', ' o‘rgatamiz.')}
                            </h2>
                        </div>

                        <p className="lede max-w-[54ch]" data-reveal data-reveal-delay="100">
                            {t('about.description')}
                        </p>

                        <div className="flex flex-col divide-y divide-[var(--line)] border-y border-line" data-reveal data-reveal-delay="180">
                            {[
                                { title: t('about.goalTitle'), desc: t('about.goalDesc') },
                                { title: t('about.teacherTitle'), desc: t('about.teacherDesc') },
                            ].map((item, i) => (
                                <div key={i} className="group flex gap-5 py-5 transition-colors duration-300">
                                    <span className="font-display text-[15px] font-semibold text-accent pt-0.5 shrink-0">
                                        0{i + 1}
                                    </span>
                                    <div>
                                        <h4 className="font-display text-[21px] font-semibold text-ink">
                                            {item.title}
                                        </h4>
                                        <p className="text-[13.5px] leading-relaxed text-muted mt-1.5 max-w-[52ch]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div data-reveal data-reveal-delay="240">
                            <Link to="/about" className="link-line text-[14px]">
                                {t('navbar.aboutUs', 'Biz haqimizda')}
                                <FaArrowRight className="w-3 h-3 btn-arrow" />
                            </Link>
                        </div>
                    </div>

                    {/* O'ng — rasm */}
                    <div className="lg:col-span-6" data-reveal="right" data-reveal-delay="120">
                        <div className="img-frame mask-reveal relative aspect-[4/3] lg:aspect-[5/5.2] w-full shadow-[var(--shadow-soft)]">
                            <div ref={imageParallax} className="absolute inset-0 will-change-transform">
                                <img
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=70&w=1400&auto=format&fit=crop"
                                    alt={t('aboutStudents.description', 'O‘quvchilar bilan ishlash jarayoni')}
                                    loading="lazy"
                                />
                            </div>

                            {/* Tajriba chipi */}
                            <div className="absolute bottom-4 left-4 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md border border-line rounded-[14px] px-5 py-3.5 flex items-center gap-4">
                                <span className="font-display text-[32px] font-semibold text-accent leading-none">5+</span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] leading-[1.5] text-muted whitespace-pre-line">
                                    {t('about.experienceText1', 'Yil') + '\n' + t('about.experienceText2', 'Tajriba')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
