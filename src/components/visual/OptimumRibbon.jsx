/**
 * OptimumRibbon — Signature abstract artwork for the hero.
 *
 * A warped, multi-layered ribbon / membrane structure built entirely with
 * SVG paths. Inspired by the reference image: dark translucent fabric with
 * crimson + warm amber light trails and sharp geometric cuts.
 *
 * Zero canvas / WebGL / GSAP — one slow CSS rotation, one pulse.
 * aria-hidden so screen readers skip decorative SVG.
 */
import React from 'react';

export default function OptimumRibbon({ id = 'rb', className = '' }) {
    const g = (n) => `${id}-${n}`;

    return (
        <svg
            className={`ox-ribbon ${className}`}
            viewBox="0 0 600 600"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* ── Gradients ── */}
                <radialGradient id={g('core')} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.32" />
                    <stop offset="35%"  stopColor="#e11d48" stopOpacity="0.18" />
                    <stop offset="70%"  stopColor="#9f1239" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#881337" stopOpacity="0"    />
                </radialGradient>

                <linearGradient id={g('r1')} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="25%"  stopColor="#f43f5e" stopOpacity="0.90" />
                    <stop offset="65%"  stopColor="#e11d48" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#881337" stopOpacity="0.35" />
                </linearGradient>

                <linearGradient id={g('r2')} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.85" />
                    <stop offset="45%"  stopColor="#e11d48" stopOpacity="0.65" />
                    <stop offset="80%"  stopColor="#be123c" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4c0519" stopOpacity="0.15" />
                </linearGradient>

                <linearGradient id={g('r3')} x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#fda4af" stopOpacity="0.75" />
                    <stop offset="50%"  stopColor="#e11d48" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#881337" stopOpacity="0.20" />
                </linearGradient>

                <linearGradient id={g('r4')} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.60" />
                    <stop offset="50%"  stopColor="#e11d48" stopOpacity="0.40" />
                    <stop offset="100%" stopColor="#9f1239" stopOpacity="0.15" />
                </linearGradient>

                <linearGradient id={g('edge')} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="50%"  stopColor="#f43f5e" stopOpacity="0.50" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.15" />
                </linearGradient>

                {/* Small blur filter for the ambient glow disc only */}
                <filter id={g('blur')} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="28" />
                </filter>

                {/* Sharper filter for the edge highlight only */}
                <filter id={g('sharp')} x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur stdDeviation="2" />
                </filter>

                {/* Clip so ribbon stays within the viewport */}
                <clipPath id={g('clip')}>
                    <circle cx="300" cy="300" r="295" />
                </clipPath>
            </defs>

            {/* ── LAYER 0: Ambient core glow (blurred, static) ── */}
            <ellipse
                cx="300" cy="300"
                rx="200" ry="200"
                fill={`url(#${g('core')})`}
                filter={`url(#${g('blur')})`}
                className="ox-ribbon__pulse"
            />

            {/* ── LAYER 1: Outer rotating composition ── */}
            <g className="ox-ribbon__rotor" clipPath={`url(#${g('clip')})`}>

                {/* ─── PRIMARY MEMBRANE BODY ─── */}
                {/* Main warped ribbon — large sweeping arc from bottom-left to top-right */}
                <path
                    d="M 60 520
                       C 80 420, 160 360, 260 300
                       C 360 240, 460 210, 540 120
                       C 530 145, 490 200, 430 255
                       C 370 310, 290 360, 200 410
                       C 150 440, 95 470, 60 520 Z"
                    fill={`url(#${g('r1')})`}
                    opacity="0.75"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* Second membrane sheet — crosses the first at an angle */}
                <path
                    d="M 100 80
                       C 160 140, 240 200, 290 295
                       C 340 390, 370 460, 480 520
                       C 505 530, 535 535, 555 530
                       C 490 470, 420 380, 360 280
                       C 300 180, 230 120, 100 80 Z"
                    fill={`url(#${g('r2')})`}
                    opacity="0.70"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* Third layer — diagonal cut across the top */}
                <path
                    d="M 80 160
                       C 140 140, 220 150, 310 200
                       C 400 250, 470 330, 530 400
                       C 540 390, 545 375, 545 360
                       C 480 295, 400 225, 310 180
                       C 230 140, 150 130, 80 160 Z"
                    fill={`url(#${g('r3')})`}
                    opacity="0.60"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* Fourth ribbon — thin interior fold */}
                <path
                    d="M 200 520
                       C 240 450, 285 380, 310 300
                       C 335 220, 350 160, 400 100
                       C 415 100, 428 105, 438 115
                       C 380 175, 360 235, 335 310
                       C 310 385, 275 455, 235 530
                       Q 218 525, 200 520 Z"
                    fill={`url(#${g('r4')})`}
                    opacity="0.55"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* ─── EDGE HIGHLIGHT RIMS (sharp, thin) ─── */}
                {/* Main ribbon edge glow */}
                <path
                    d="M 60 520
                       C 80 420, 160 360, 260 300
                       C 360 240, 460 210, 540 120"
                    fill="none"
                    stroke={`url(#${g('edge')})`}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                />

                {/* Second ribbon edge */}
                <path
                    d="M 100 80
                       C 160 140, 240 200, 290 295
                       C 340 390, 370 460, 480 520"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                />

                {/* Third edge */}
                <path
                    d="M 80 160
                       C 140 140, 220 150, 310 200
                       C 400 250, 470 330, 530 400"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1"
                    strokeOpacity="0.45"
                />

                {/* Interior fold highlight */}
                <path
                    d="M 200 520 C 240 450, 285 380, 310 300 C 335 220, 350 160, 400 100"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeOpacity="0.40"
                />

                {/* ─── GEOMETRIC INCISION LINES ─── */}
                {/* Horizontal architectural cut */}
                <line x1="55"  y1="295" x2="545" y2="295"
                    stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                {/* Diagonal thin annotation line */}
                <line x1="120" y1="80"  x2="480" y2="520"
                    stroke="rgba(225,29,72,0.25)" strokeWidth="0.8" />
                {/* Vertical centre cut */}
                <line x1="300" y1="55"  x2="300" y2="545"
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                {/* ─── LIGHT TRAIL DOTS ─── */}
                <circle cx="260" cy="300" r="2.5" fill="#ffffff" opacity="0.85" />
                <circle cx="310" cy="245" r="1.8" fill="#f43f5e" opacity="0.80" />
                <circle cx="356" cy="195" r="1.5" fill="#ffffff" opacity="0.70" />
                <circle cx="430" cy="158" r="2.2" fill="#fda4af" opacity="0.75" />
                <circle cx="195" cy="385" r="1.6" fill="#f43f5e" opacity="0.65" />

                {/* ─── SECONDARY ACCENT LAYER — counter-composition ─── */}
                {/* Wide translucent arc for depth */}
                <path
                    d="M 40 350
                       C 90 270, 200 210, 300 200
                       C 400 190, 490 240, 560 320
                       C 560 335, 555 350, 545 362
                       C 470 280, 370 230, 280 240
                       C 190 250, 90 308, 40 390
                       Z"
                    fill="rgba(225,29,72,0.12)"
                    opacity="0.80"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* Opposing sweep for asymmetry */}
                <path
                    d="M 560 260
                       C 510 330, 410 380, 300 390
                       C 190 400, 100 360, 40 290
                       Q 40 305, 42 320
                       C 105 395, 198 435, 305 425
                       C 412 415, 510 360, 560 285
                       Z"
                    fill="rgba(159,18,57,0.12)"
                    opacity="0.75"
                    style={{ mixBlendMode: 'screen' }}
                />
            </g>

            {/* ── LAYER 2: Static top-right corner marker (never rotates) ── */}
            {/* Small CDI badge annotation dot cluster */}
            <circle cx="528" cy="80" r="3" fill="#e11d48" opacity="0.55" />
            <circle cx="540" cy="80" r="1.5" fill="#e11d48" opacity="0.35" />
            <line x1="510" y1="80" x2="470" y2="80"
                stroke="rgba(225,29,72,0.25)" strokeWidth="0.8" />
            <text
                x="465" y="77"
                fill="rgba(255,255,255,0.25)"
                fontSize="7"
                fontFamily="monospace"
                letterSpacing="1.5"
                textAnchor="end"
            >CDI LAB / OFFICIAL</text>
        </svg>
    );
}
