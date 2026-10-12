import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FaUserPlus, FaClipboardCheck, FaRocket, FaArrowRight } from 'react-icons/fa'

export default function Sec2() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const steps = [
        {
            num: '01',
            icon: <FaUserPlus />,
            phase: t('steps.phase1', 'Boshlanish'),
            title: t('steps.step1Title', "Ro'yxatdan o'tish"),
            desc: t('steps.step1Desc', "Shaxsiy ma'lumotlaringizni qoldiring va mutaxassis bilan bepul konsultatsiyaga yoziling."),
            path: '/register',
            actionText: t('steps.action1', "Ro'yxatdan o'tish"),
            highlight: t('steps.h1', '1 daqiqa vaqt'),
        },
        {
            num: '02',
            icon: <FaClipboardCheck />,
            phase: t('steps.phase2', 'Tahlil'),
            title: t('steps.step2Title', 'Darajangizni aniqlash'),
            desc: t('steps.step2Desc', '30 daqiqalik CDI va grammatika testini topshirib, aniq darajangiz va kamchiliklaringizni biling.'),
            path: '/level-test',
            actionText: t('steps.action2', 'Test topshirish'),
            highlight: t('steps.h2', 'Bepul tahlil'),
        },
        {
            num: '03',
            icon: <FaRocket />,
            phase: t('steps.phase3', 'Natija'),
            title: t('steps.step3Title', "O'qishni boshlash"),
            desc: t('steps.step3Desc', "Mos tarifni tanlab, IELTS 8.0+ darajali mentorlar bilan maqsad sari qat'iy intiling."),
            path: '/pricing',
            actionText: t('steps.action3', 'Tariflar bilan tanishish'),
            highlight: t('steps.h3', "Kafolatlangan o'sish"),
        }
    ]

    return (
        <section
            className="relative overflow-hidden"
            style={{
                padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 80px)',
                background: 'transparent',
            }}
        >
            {/* Architectural top divider */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 75%, transparent)' }}
            />

            {/* Ambient red glow — right side */}
            <div
                className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
                style={{
                    width: 'clamp(300px, 50vw, 600px)',
                    height: 'clamp(300px, 50vw, 600px)',
                    background: 'radial-gradient(ellipse at right center, rgba(225,29,72,0.10) 0%, transparent 68%)',
                }}
            />

            <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

                {/* Section header */}
                <div style={{ maxWidth: '640px', marginBottom: 'clamp(48px, 8vh, 80px)' }}>
                    {/* Label */}
                    <p style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#f43f5e',
                        marginBottom: '20px',
                    }}>
                        <span style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: '#f43f5e', display: 'inline-block',
                        }} />
                        {t('steps.badge', '3 ODDIY QADAM // THE FAST TRACK')}
                    </p>

                    <h2 style={{
                        margin: 0,
                        fontFamily: 'var(--font-heading, system-ui)',
                        fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.02,
                        color: '#f2ede8',
                    }}>
                        {t('steps.title', "Qanday qilib o'qishni")}{' '}
                        <span style={{ color: '#f43f5e' }}>boshlaysiz?</span>
                    </h2>

                    <p style={{
                        marginTop: 'clamp(12px, 2vw, 20px)',
                        fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
                        lineHeight: 1.7,
                        color: 'rgba(242,237,232,0.55)',
                    }}>
                        {t('steps.description', "IELTS orzuingiz sari atigi 3 ta qadam qoldi. Sinovdan o'ting, tahlil oling va guruhga qo'shiling.")}
                    </p>
                </div>

                {/* Steps grid — Responsive 1 column on mobile, 3 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting horizontal rule (desktop) */}
                    <div
                        className="hidden lg:block absolute"
                        style={{
                            top: '52px',
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(225,29,72,0.3) 30%, rgba(225,29,72,0.3) 70%, transparent)',
                        }}
                    />

                    {steps.map((item, index) => (
                        <article
                            key={item.num}
                            onClick={() => navigate(item.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
                            aria-label={item.title}
                            style={{
                                position: 'relative',
                                padding: 'clamp(28px, 3.5vw, 44px)',
                                background: 'rgba(12,13,16,0.92)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '24px',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0',
                                boxShadow: '0 12px 36px -4px rgba(0,0,0,0.5)',
                                transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(225,29,72,0.5)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 45px -4px rgba(225,29,72,0.18)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 12px 36px -4px rgba(0,0,0,0.5)';
                            }}
                        >
                            {/* Top accent line on hover */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0,
                                height: '2px',
                                background: index === 1
                                    ? 'linear-gradient(90deg, transparent, rgba(225,29,72,0.8), transparent)'
                                    : 'transparent',
                            }} />

                            {/* Step number (huge watermark) */}
                            <span style={{
                                position: 'absolute',
                                top: '16px',
                                right: '20px',
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(3rem, 5vw, 5rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.05em',
                                color: 'rgba(255,255,255,0.05)',
                                lineHeight: 1,
                                userSelect: 'none',
                                pointerEvents: 'none',
                            }}>
                                {item.num}
                            </span>

                            {/* Icon */}
                            <div style={{
                                width: '48px', height: '48px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(225,29,72,0.30)',
                                background: 'rgba(225,29,72,0.1)',
                                borderRadius: '16px',
                                color: '#f43f5e',
                                fontSize: '1.1rem',
                                marginBottom: '24px',
                                flexShrink: 0,
                            }}>
                                {item.icon}
                            </div>

                            {/* Phase label */}
                            <p style={{
                                margin: '0 0 10px',
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: '#f43f5e',
                            }}>
                                {item.num} // {item.phase}
                            </p>

                            {/* Title */}
                            <h3 style={{
                                margin: '0 0 14px',
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.25rem, 2vw, 1.7rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                                color: '#f2ede8',
                            }}>
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                margin: 0,
                                fontSize: 'clamp(0.82rem, 1vw, 0.92rem)',
                                lineHeight: 1.7,
                                color: 'rgba(242,237,232,0.55)',
                                flex: 1,
                            }}>
                                {item.desc}
                            </p>

                            {/* Bottom footer */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '28px',
                                paddingTop: '20px',
                                borderTop: '1px solid rgba(255,255,255,0.07)',
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'rgba(242,237,232,0.55)',
                                    letterSpacing: '0.04em',
                                }}>
                                    {item.actionText}
                                </span>
                                <div style={{
                                    width: '38px', height: '38px',
                                    borderRadius: '9999px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(90deg, #E11D48, #F43F5E)',
                                    color: '#ffffff',
                                    fontSize: '0.8rem',
                                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                }}>
                                    <FaArrowRight />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Architectural bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 75%, transparent)' }}
            />
        </section>
    )
}