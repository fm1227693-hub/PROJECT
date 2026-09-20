import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
    HiLightningBolt,
    HiCheckCircle,
    HiSparkles,
    HiLocationMarker,
    HiPhone,
    HiExternalLink,
    HiArrowRight
} from 'react-icons/hi'

// Rasmda ko'rsatilgan Premier School manzili uchun doimiy (constant) ma'lumotlar
const FIXED_LOCATION = {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.0124155!2d64.410986!3d39.7647863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5007c3f9d243a7%3A0x3c52dea5c997b375!2sPremier%20School!5e0!3m2!1suz!2suz!4v1650000000000!5m2!1suz!2suz",
    addressText: "Namozgoh St, Bukhara",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
}

const PRINCIPLES = [
    { to: '/principle/1', icon: HiLightningBolt, titleKey: 'aboutUs.card1Title', descKey: 'aboutUs.card1Desc', tagKey: 'aboutUs.card1Tag' },
    { to: '/principle/2', icon: HiCheckCircle, titleKey: 'aboutUs.card2Title', descKey: 'aboutUs.card2Desc', tagKey: 'aboutUs.card2Tag' },
    { to: '/principle/3', icon: HiSparkles, titleKey: 'aboutUs.card3Title', descKey: 'aboutUs.card3Desc', tagKey: 'aboutUs.card3Tag' },
]

export default function AboutUs() {
    const { t } = useTranslation()

    return (
        <div className="container-site pt-[130px] pb-20 sm:pb-24 select-none">

            {/* 1-Bo'lim: Sarlavha */}
            <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-16 sm:mb-20 pb-12 border-b border-line">
                <div className="lg:col-span-6">
                    <span className="eyebrow">{t('aboutUs.badge')}</span>
                    <h1 className="display-2 mt-5 text-ink">
                        {t('aboutUs.title')}
                    </h1>
                </div>
                <div className="lg:col-span-6 flex flex-col gap-4">
                    <p className="text-soft text-[15px] sm:text-[17px] leading-relaxed">
                        {t('aboutUs.description1')}
                    </p>
                    <p className="text-muted text-[13.5px] sm:text-[14.5px] leading-relaxed">
                        {t('aboutUs.description2')}
                    </p>
                </div>
            </div>

            {/* 2-Bo'lim: 3 tamoyil kartochkasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20">
                {PRINCIPLES.map((p, i) => {
                    const Icon = p.icon
                    return (
                        <Link
                            key={p.to}
                            to={p.to}
                            data-reveal
                            data-reveal-delay={String(i * 110)}
                            className="group card !rounded-[18px] p-7 sm:p-8 flex flex-col justify-between gap-8 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] hover:border-linestrong transition-all duration-500"
                        >
                            <div>
                                <div className="w-11 h-11 rounded-[12px] bg-accentsoft border border-accent/20 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-400">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-display text-[23px] font-semibold text-ink leading-snug">{t(p.titleKey)}</h3>
                                <p className="text-muted text-[13.5px] leading-relaxed mt-3">
                                    {t(p.descKey)}
                                </p>
                            </div>
                            <span className="text-[11px] font-bold text-muted mt-6 flex items-center gap-2 uppercase tracking-[0.12em] group-hover:text-accent transition-colors duration-300">
                                {t(p.tagKey)}
                                <HiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </Link>
                    )
                })}
            </div>

            {/* 3-Bo'lim: Manzil va xarita */}
            <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16 sm:mb-20">
                <div className="space-y-5">
                    <span className="eyebrow">{t('aboutUs.locationBadge')}</span>
                    <h2 className="display-2 text-ink">
                        {t('aboutUs.locationTitle')}
                    </h2>
                    <p className="lede max-w-[52ch]">
                        {t('aboutUs.locationDesc')}
                    </p>
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center gap-4 border border-line rounded-[14px] px-4 py-3.5 bg-surface">
                            <div className="w-9 h-9 bg-accentsoft text-accent rounded-full flex items-center justify-center shrink-0">
                                <HiLocationMarker className="w-4 h-4" />
                            </div>
                            <span className="text-soft font-semibold text-[13.5px]">
                                {t('aboutUs.address')}
                            </span>
                        </div>
                        <a
                            href="tel:+998900829979"
                            className="flex items-center gap-4 border border-line rounded-[14px] px-4 py-3.5 bg-surface hover:border-linestrong transition-colors"
                        >
                            <div className="w-9 h-9 bg-accentsoft text-accent rounded-full flex items-center justify-center shrink-0">
                                <HiPhone className="w-4 h-4" />
                            </div>
                            <span className="text-soft font-semibold text-[13.5px]">
                                +998 90 082 99 79
                            </span>
                        </a>
                    </div>
                </div>

                {/* Premier School xaritasi */}
                <div className="img-frame relative h-64 sm:h-72 md:h-80 w-full shadow-[var(--shadow-soft)] group">
                    <img
                        src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn2hAnbM-pwUXbUAFCMNmHj7g7mnAZQ-wcb2pEp5HyI7IMWSX9uaNjrTTEpgqg8F5mEjc-or2G-ZhyC98A1jfIFT4SYN3zsCJBr5gHi-jsL6tHCMpS9p-kbw5Om3h-kJtwmWlEJIzwQoiim=w408-h544-k-no"
                        alt={t('aboutUs.locationTitle')}
                        loading="lazy"
                    />

                    <a
                        href={FIXED_LOCATION.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 left-4 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md hover:bg-ink hover:text-bg px-3.5 py-2 rounded-[10px] border border-line shadow-[var(--shadow-soft)] flex items-center gap-2 transition-all duration-300 z-10"
                    >
                        <span className="text-[11.5px] font-semibold flex items-center gap-2">
                            {t('aboutUs.openInMaps')} <HiExternalLink className="opacity-60 text-[13px]" />
                        </span>
                    </a>

                    <div className="absolute bottom-4 left-4 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md px-4 py-2.5 rounded-[10px] border border-line shadow-[var(--shadow-soft)]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-soft">
                            {FIXED_LOCATION.addressText}
                        </span>
                    </div>
                </div>
            </div>

            {/* 4-Bo'lim: Yakuniy statistika */}
            <div data-reveal className="card !rounded-[20px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl text-center md:text-left">
                    <h2 className="font-display text-[26px] sm:text-[32px] font-semibold text-ink">{t('aboutUs.footerTitle')}</h2>
                    <p className="text-muted text-[13.5px] leading-relaxed">
                        {t('aboutUs.footerDesc')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-10 shrink-0">
                    <div className="text-center">
                        <span className="block font-display text-[40px] sm:text-[52px] font-semibold text-ink leading-none">100%</span>
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted mt-2 block">{t('aboutUs.stat1Label')}</span>
                    </div>
                    <div className="w-px h-12 bg-line hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block font-display text-[40px] sm:text-[52px] font-semibold text-accent leading-none">7/24</span>
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted mt-2 block">{t('aboutUs.stat2Label')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
