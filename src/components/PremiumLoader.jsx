import React, { useState, useEffect, useMemo } from 'react';

/**
 * PremiumLoader — "VIP Access" uslubidagi premium yuklovchi (loader).
 * Bu variant markazga PTIMUM ning TO'LIQ logotipini (matni bilan) joylaydi.
 * Nishon rasmi tashqi faylga havola qilingan: public/ptimum-logo-transparent-full.png
 *
 * Props:
 *  - text        : markaziy wordmark matni (default: "KIRISH")
 *  - captions    : progress bosqichlariga mos 4 ta matn massivi
 *  - loop        : ichki demo progress 100% dan keyin 0 ga qaytsinmi (default: true)
 *  - progress    : 0-100 raqam bersangiz komponent shu qiymatga "boshqariladigan"
 *                  (controlled) rejimga o'tadi va ichki taymerni to'xtatadi —
 *                  haqiqiy yuklanish foizini o'zingiz uzatishingiz mumkin.
 */

const DEFAULT_CAPTIONS = [
  "Ma'lumotlar tekshirilmoqda",
  'Kirish tasdiqlanmoqda',
  'Deyarli tayyor',
  'Xush kelibsiz',
];

// PTIMUM ning to'liq logotipi (matni bilan), foni olib tashlangan.
// Faylni public/ptimum-logo-transparent-full.png sifatida loyihangizga joylashtiring.
const EMBLEM_SRC = '/ptimum-logo-transparent-full.png';

export default function PremiumLoader({
  text = 'KIRISH',
  captions = DEFAULT_CAPTIONS,
  loop = true,
  progress: controlledProgress,
}) {
  const [internalProgress, setInternalProgress] = useState(0);
  const isControlled = typeof controlledProgress === 'number';
  const progress = isControlled
    ? Math.min(100, Math.max(0, Math.round(controlledProgress)))
    : internalProgress;

  useEffect(() => {
    if (isControlled) return undefined;
    const id = setInterval(() => {
      setInternalProgress((p) => {
        if (p >= 100) return loop ? 0 : 100;
        return p + 1;
      });
    }, 40);
    return () => clearInterval(id);
  }, [isControlled, loop]);

  const stage =
    progress >= 100 ? 3 : progress >= 75 ? 2 : progress >= 35 ? 1 : 0;

  // Watch-bezel tick koordinatalarini hisoblash (24 ta chiziq, har 6-chisi katta)
  const ticks = useMemo(() => {
    const center = 75;
    const rOuter = 72;
    const rMinor = 65;
    const rMajor = 60;
    return Array.from({ length: 24 }, (_, i) => {
      const angleDeg = (i * 360) / 24 - 90;
      const rad = (angleDeg * Math.PI) / 180;
      const major = i % 6 === 0;
      const rInner = major ? rMajor : rMinor;
      return {
        x1: center + rOuter * Math.cos(rad),
        y1: center + rOuter * Math.sin(rad),
        x2: center + rInner * Math.cos(rad),
        y2: center + rInner * Math.sin(rad),
        major,
      };
    });
  }, []);

  return (
    <div className="pl-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .pl-wrapper {
          --void: #070505;
          --crimson: #C81034;
          --ember: #FF3B54;
          --garnet: #4A0713;
          --bone: #F3E9E5;
          --ash: #8B7A7A;

          position: fixed;
          inset: 0;
          z-index: 999999;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 42%, #150406 0%, var(--void) 55%, #000000 100%);
          overflow: hidden;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
        }

        .pl-wrapper *, .pl-wrapper *::before, .pl-wrapper *::after {
          box-sizing: border-box;
        }

        .pl-corner {
          position: absolute;
          width: 26px;
          height: 26px;
          opacity: 0;
          animation: bracketIn 0.6s ease forwards;
        }
        .pl-corner-tl { top: 22px; left: 22px; border-top: 1px solid var(--crimson); border-left: 1px solid var(--crimson); animation-delay: 0.1s; }
        .pl-corner-tr { top: 22px; right: 22px; border-top: 1px solid var(--crimson); border-right: 1px solid var(--crimson); animation-delay: 0.25s; }
        .pl-corner-bl { bottom: 22px; left: 22px; border-bottom: 1px solid var(--crimson); border-left: 1px solid var(--crimson); animation-delay: 0.4s; }
        .pl-corner-br { bottom: 22px; right: 22px; border-bottom: 1px solid var(--crimson); border-right: 1px solid var(--crimson); animation-delay: 0.55s; }

        @keyframes bracketIn {
          from { opacity: 0; width: 0; height: 0; }
          to { opacity: 1; width: 26px; height: 26px; }
        }

        .pl-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pl-emblem {
          position: relative;
          width: 170px;
          height: 170px;
        }

        .pl-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,59,84,0.35) 0%, rgba(255,59,84,0) 70%);
          filter: blur(4px);
          animation: glowPulse 3.2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.94); }
          50% { opacity: 1; transform: scale(1.04); }
        }

        .pl-bezel {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150px;
          height: 150px;
          margin: -75px 0 0 -75px;
          animation: bezelSpin 22s linear infinite;
        }

        @keyframes bezelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .pl-gem-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 115px;
          height: 59px;
          margin: -30px 0 0 -58px;
          perspective: 500px;
        }

        .pl-gem-img {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 0 9px rgba(255,59,84,0.75)) drop-shadow(0 0 18px rgba(200,16,52,0.45));
          animation: gemBreathe 4s ease-in-out infinite;
        }

        @keyframes gemBreathe {
          0%, 100% {
            filter: drop-shadow(0 0 9px rgba(255,59,84,0.75)) drop-shadow(0 0 18px rgba(200,16,52,0.45));
          }
          50% {
            filter: drop-shadow(0 0 13px rgba(255,59,84,0.95)) drop-shadow(0 0 26px rgba(200,16,52,0.6));
          }
        }

        .pl-gem-shine-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          -webkit-mask-image: url(${EMBLEM_SRC});
          mask-image: url(${EMBLEM_SRC});
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
        }

        .pl-gem-shine {
          position: absolute;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent);
          animation: gemShine 2.8s ease-in-out infinite;
        }

        @keyframes gemShine {
          0% { left: -30%; opacity: 0; }
          12% { opacity: 0.9; }
          45% { opacity: 0.9; }
          60% { opacity: 0; }
          100% { left: 100%; opacity: 0; }
        }

        .pl-wordmark {
          margin-top: 30px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pl-wordmark-line {
          width: 26px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--crimson));
        }
        .pl-wordmark-line.right {
          background: linear-gradient(90deg, var(--crimson), transparent);
        }

        .pl-wordmark-text {
          font-family: 'Cinzel', 'Times New Roman', serif;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: 7px;
          color: var(--bone);
          text-shadow: 0 0 16px rgba(255,59,84,0.55);
        }

        .pl-caption {
          margin-top: 10px;
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--ash);
          text-transform: uppercase;
          animation: captionFade 0.5s ease both;
          min-height: 14px;
          text-align: center;
        }

        @keyframes captionFade {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pl-scan-track {
          position: relative;
          margin-top: 26px;
          width: 190px;
          height: 1px;
          background: rgba(139,122,122,0.3);
        }

        .pl-scan-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--garnet), var(--crimson));
          transition: width 0.08s linear;
        }

        .pl-scan-dot {
          position: absolute;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ember);
          box-shadow: 0 0 8px 2px rgba(255,59,84,0.85);
          transform: translate(-50%, -50%);
          transition: left 0.08s linear;
        }

        .pl-percent {
          margin-top: 14px;
          font-size: 26px;
          font-weight: 600;
          letter-spacing: 1px;
          color: var(--bone);
          font-variant-numeric: tabular-nums;
        }

        .pl-percent-sign {
          font-size: 14px;
          color: var(--ash);
          margin-left: 2px;
        }
      `}</style>

      <span className="pl-corner pl-corner-tl" />
      <span className="pl-corner pl-corner-tr" />
      <span className="pl-corner pl-corner-bl" />
      <span className="pl-corner pl-corner-br" />

      <div className="pl-content">
        <div className="pl-emblem">
          <div className="pl-glow" />

          <div className="pl-bezel">
            <svg viewBox="0 0 150 150" width="150" height="150">
              <circle cx="75" cy="75" r="72" fill="none" stroke="rgba(200,16,52,0.3)" strokeWidth="1" />
              <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(200,16,52,0.18)" strokeWidth="1" />
              {ticks.map((t, i) => (
                <line
                  key={i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.major ? '#FF3B54' : 'rgba(255,59,84,0.35)'}
                  strokeWidth={t.major ? 1.3 : 0.7}
                />
              ))}
            </svg>
          </div>

          {/* PTIMUM ning to'liq logotipi (matni bilan) — public/ papkasidagi rasmdan */}
          <div className="pl-gem-wrap">
            <img className="pl-gem-img" src={EMBLEM_SRC} alt="PTIMUM School of English" />
            <div className="pl-gem-shine-wrap">
              <div className="pl-gem-shine" />
            </div>
          </div>
        </div>

        <div className="pl-wordmark">
          <span className="pl-wordmark-line" />
          <span className="pl-wordmark-text">{text}</span>
          <span className="pl-wordmark-line right" />
        </div>

        <div className="pl-caption" key={stage}>
          {captions[stage]}
        </div>

        <div className="pl-scan-track">
          <div className="pl-scan-fill" style={{ width: `${progress}%` }} />
          <div className="pl-scan-dot" style={{ left: `${progress}%` }} />
        </div>

        <div className="pl-percent">
          {String(progress).padStart(2, '0')}
          <span className="pl-percent-sign">%</span>
        </div>
      </div>
    </div>
  );
} nuni