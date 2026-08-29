import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventBus } from '../utils/eventEmitter';
import './LevelsScroll.css';

gsap.registerPlugin(ScrollTrigger);

const Icons = {
  beginner: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  ),
  elementary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7h6M9 10.5h4" strokeLinecap="round" />
    </svg>
  ),
  intermediate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l3.5 6.5L22 12l-6.5 3.5L12 22l-3.5-6.5L2 12l6.5-3.5L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  upper: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 4h10v4.2a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5 3.5 3.5 0 0 0 6.5 10H7M17 5h2.5A1.5 1.5 0 0 1 21 6.5 3.5 3.5 0 0 1 17.5 10H17" strokeLinecap="round" />
      <path d="M12 13.2V17M9 20.5h6M10 17h4v2.2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V17z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  advanced: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2.5c3 2.2 4.8 5.6 4.8 9.7 0 3-1 5.6-2.6 7.5l-.9-2.6a3.2 3.2 0 0 0-2.6-2.1 3.2 3.2 0 0 0-2.6 2.1l-.9 2.6C5.6 17.8 4.6 15.2 4.6 12.2c0-4.1 1.8-7.5 4.8-9.7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M8.5 19.5l-1.3 2M15.5 19.5l1.3 2" strokeLinecap="round" />
    </svg>
  ),
};

const LEVELS = [
  {
    key: 'beginner',
    labelKey: 'levels.beginner.label',
    band: 'A1 – A2',
    descKey: 'levels.beginner.desc',
    icon: Icons.beginner,
    accentColor: '#34d399',
    accentRgb: '52, 211, 153',
    features: ['levels.beginner.f1', 'levels.beginner.f2', 'levels.beginner.f3'],
    duration: '3–4 oy',
  },
  {
    key: 'elementary',
    labelKey: 'levels.elementary.label',
    band: 'A2 – B1',
    descKey: 'levels.elementary.desc',
    icon: Icons.elementary,
    accentColor: '#38bdf8',
    accentRgb: '56, 189, 248',
    features: ['levels.elementary.f1', 'levels.elementary.f2', 'levels.elementary.f3'],
    duration: '3–4 oy',
  },
  {
    key: 'intermediate',
    labelKey: 'levels.intermediate.label',
    band: 'B1 – B2',
    descKey: 'levels.intermediate.desc',
    icon: Icons.intermediate,
    accentColor: '#a78bfa',
    accentRgb: '167, 139, 250',
    features: ['levels.intermediate.f1', 'levels.intermediate.f2', 'levels.intermediate.f3'],
    duration: '4–5 oy',
  },
  {
    key: 'upper',
    labelKey: 'levels.upper.label',
    band: 'B2 – C1',
    descKey: 'levels.upper.desc',
    icon: Icons.upper,
    accentColor: '#fbbf24',
    accentRgb: '251, 191, 36',
    features: ['levels.upper.f1', 'levels.upper.f2', 'levels.upper.f3'],
    duration: '4–5 oy',
  },
  {
    key: 'advanced',
    labelKey: 'levels.advanced.label',
    band: 'C1 – C2',
    descKey: 'levels.advanced.desc',
    icon: Icons.advanced,
    accentColor: '#fb7185',
    accentRgb: '251, 113, 133',
    features: ['levels.advanced.f1', 'levels.advanced.f2', 'levels.advanced.f3'],
    duration: '5–6 oy',
  },
];

const D = {
  'levels.sectionBadge': 'Kurs darajalari',
  'levels.sectionTitle': "O'z darajangizni tanlang",
  'levels.sectionDesc': "Beginner'dan Advanced'gacha — har bir o'quvchi uchun to'g'ri yo'l.",
  'levels.beginner.label': 'Beginner',
  'levels.beginner.desc': "Noldan boshlaydiganlar uchun: alifbo, asosiy so'zlar va grammatika.",
  'levels.beginner.f1': 'Harflar va tovushlar',
  'levels.beginner.f2': 'Kundalik iboralar',
  'levels.beginner.f3': 'Asosiy grammatika',
  'levels.elementary.label': 'Elementary',
  'levels.elementary.desc': "Bazaviy bilimlarni mustahkamlab, oddiy suhbat va matnlarni tushunish.",
  'levels.elementary.f1': 'Present va Past tense',
  'levels.elementary.f2': "So'z boyligini kengaytirish",
  'levels.elementary.f3': 'Oddiy matn yozish',
  'levels.intermediate.label': 'Intermediate',
  'levels.intermediate.desc': "IELTS 5.0–6.0 maqsadi. Akademik lug'at, yozma nutq, mock testlar.",
  'levels.intermediate.f1': 'IELTS Writing Task 1 va 2',
  'levels.intermediate.f2': 'Academic vocabulary',
  'levels.intermediate.f3': 'Mock testlar',
  'levels.upper.label': 'Upper-Intermediate',
  'levels.upper.desc': "IELTS 6.5–7.0. CDI simulyatsiyasi va keng lug'at bazasi.",
  'levels.upper.f1': 'CDI Listening va Reading',
  'levels.upper.f2': 'Advanced Grammar',
  'levels.upper.f3': 'Natija tahlili',
  'levels.advanced.label': 'Advanced',
  'levels.advanced.desc': "IELTS 7.5–8.5+ maqsad. Barcha modullar va AI tahlil.",
  'levels.advanced.f1': 'IELTS 8.5 strategiyasi',
  'levels.advanced.f2': 'AI yozuv baholash',
  'levels.advanced.f3': "To'liq mock imtihon",
  'levels.cta': 'Bepul sinov darsi',
  'levels.duration': 'Davomiyligi',
};

export default function LevelsScroll() {
  const { t } = useTranslation();
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const ctxRef = useRef(null);
  const navTriggerRef = useRef(null);

  const tr = (key) => t(key, D[key] || key);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    const setNavHidden = (hidden) => {
      eventBus.emit('toggle-nav', hidden);
    };

    const init = () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
      }

      ctxRef.current = gsap.context(() => {
        const panels = gsap.utils.toArray('.lvl-panel-anim');

        // Create one master timeline for the whole wrapper
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            // Huge scroll space to give each phase plenty of time
            end: `+=${panels.length * 300}%`,
            scrub: 1, // Smooth out the scrub
            pin: true,
            // Automatically hide navbar when this timeline is active
            onToggle: (self) => setNavHidden(self.isActive),
          }
        });

        panels.forEach((panel, i) => {
          const visual = panel.querySelector('.lvl-visual');
          const text = panel.querySelector('.lvl-text');

          // Initial states
          gsap.set(visual, {
             width: isMobile ? '92vw' : '86vw', // Nice and large initially!
             height: isMobile ? 'auto' : '86vh',
             borderRadius: 12,
             x: 0
          });
          // Hide text initially
          gsap.set(text, { autoAlpha: 0, x: -40 });

          // 0. Hold the initial full-screen state so the user DEFINITELY sees it
          tl.to({}, { duration: 1.0 });

          // 1. Zoom out the current panel to the right
          tl.to(visual, { 
              width: isMobile ? '92vw' : '44vw', 
              height: isMobile ? 'auto' : '62vh', 
              borderRadius: 24, 
              x: isMobile ? 0 : '24vw', 
              ease: 'power2.inOut',
              duration: 1.5
            }, `+=0`)
            // Fade in the text on the left simultaneously
            .to(text, { autoAlpha: 1, x: 0, ease: 'power2.inOut', duration: 1.5 }, `<`);
          
          // 2. Hold the shrunk state for reading
          tl.to({}, { duration: 1.5 });

          // 3. If not the last panel, slide the track left to bring in the next panel's 80% screen
          if (i < panels.length - 1) {
            tl.to(trackRef.current, {
              x: `-${(i + 1) * 100}vw`,
              ease: 'power3.inOut',
              duration: 2.0
            });
          }
        });

        ScrollTrigger.refresh();
      }, wrapperRef);
    };

    const timer = setTimeout(init, 100);

    return () => {
      clearTimeout(timer);
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
      if (navTriggerRef.current) {
        navTriggerRef.current.kill();
      }
      setNavHidden(false);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="levels-wrapper" aria-label={tr('levels.sectionTitle')}>
      <div className="lvl-pin">
        <div ref={trackRef} className="lvl-track">
          {LEVELS.map((level, index) => (
            <section
              key={level.key}
              className="lvl-panel-anim"
              style={{
                '--accent': level.accentColor,
                '--accent-rgb': level.accentRgb,
              }}
            >
              <div className="lvl-bg" aria-hidden="true">
                <div className="lvl-grid" />
                <div className="lvl-noise" />
              </div>

              {/* Left side text that fades in */}
              <div className="lvl-text">
                <span className="lvl-idx" aria-hidden="true">0{index + 1}</span>

                <div className="lvl-band-row">
                  <span className="lvl-band">{level.band}</span>
                  <span className="lvl-band-sub">CEFR</span>
                </div>

                <div className="lvl-icon-circle">
                  <span className="lvl-icon" role="img" aria-label={tr(level.labelKey)}>
                    {level.icon}
                  </span>
                </div>

                <h2 className="lvl-name">{tr(level.labelKey)}</h2>
                <p className="lvl-desc">{tr(level.descKey)}</p>

                <Link to="/form" className="lvl-cta">
                  <span>{tr('levels.cta')}</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18" style={{marginLeft: 8}}>
                    <path d="M4 10h12M11 6l4 4-4 4" stroke="currentColor"
                      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Right side glass card that shrinks */}
              <div className="lvl-visual">
                <div className="lvl-visual-inner">
                  <p className="lvl-right-label">Nima o'rganasiz?</p>
                  
                  <ul className="lvl-features">
                    {level.features.map((fKey, fi) => (
                      <li key={fKey} className="lvl-feature-item">
                        <span className="lvl-feature-num" style={{ color: level.accentColor }}>
                          {String(fi + 1).padStart(2, '0')}
                        </span>
                        <span className="lvl-feature-text">{tr(fKey)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="lvl-duration">
                    <span className="lvl-duration-label">{tr('levels.duration')}</span>
                    <span className="lvl-duration-val" style={{ color: level.accentColor }}>
                      {level.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lvl-panel-counter" aria-hidden="true">
                <span style={{ color: level.accentColor }}>{index + 1}</span>
                <span style={{ fontSize: 11, opacity: 0.5, margin: '0 4px' }}>/</span>
                <span>{LEVELS.length}</span>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}