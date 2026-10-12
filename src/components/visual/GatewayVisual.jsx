import React from 'react';

/**
 * THE GATEWAY — A New Level of Possibility
 *
 * A meaningful architectural brand visual for Optimum Education.
 * Symbolizes entering a new world of knowledge, personal growth, and opportunity.
 *
 * Visual Components:
 * - Dual sculptural monolithic portal columns in deep crimson & burgundy.
 * - Restrained cyan edge bevel illumination.
 * - Radiant golden/amber sunrise horizon glowing through the gateway opening.
 * - Reflective floor pathway converging into the portal.
 * - Ultra-lightweight inline SVG + subtle CSS opacity entrance.
 * - ZERO Three.js / WebGL / Canvas / continuous animation loops.
 */
export default function GatewayVisual({ className = '' }) {
  return (
    <div
      className={`relative w-full h-[380px] sm:h-[460px] lg:h-[500px] flex items-center justify-center select-none ${className}`}
    >
      <style>{`
        @keyframes gatewayEntrance {
          0% {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .gateway-container {
          animation: gatewayEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .gateway-container {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Atmospheric Horizon Light Leak (Hardware Radial Gradient, 0 Blur Filter) */}
      <div
        className="pointer-events-none absolute w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full -z-10 opacity-75"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(225, 29, 72, 0.12) 35%, rgba(136, 19, 55, 0.05) 60%, transparent 75%)
          `
        }}
      />

      {/* Main Vector Architectural Artwork */}
      <div className="gateway-container relative w-[310px] sm:w-[390px] lg:w-[430px] h-[310px] sm:h-[390px] lg:h-[430px] flex items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="The Gateway — Optimum Education"
          role="img"
        >
          <defs>
            {/* 1. Monolith Gradients: Left Column (Deep Crimson & Burgundy) */}
            <linearGradient id="monolithLeftFront" x1="130" y1="70" x2="215" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="35%" stopColor="#be123c" />
              <stop offset="75%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#25030c" />
            </linearGradient>

            <linearGradient id="monolithLeftInner" x1="215" y1="120" x2="235" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="50%" stopColor="#50071c" />
              <stop offset="100%" stopColor="#1a0208" />
            </linearGradient>

            <linearGradient id="monolithLeftBevel" x1="120" y1="70" x2="155" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#350410" />
            </linearGradient>

            {/* 2. Monolith Gradients: Right Column (Asymmetrical Architectural Twin) */}
            <linearGradient id="monolithRightFront" x1="370" y1="70" x2="285" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="35%" stopColor="#9f1239" />
              <stop offset="75%" stopColor="#3d030f" />
              <stop offset="100%" stopColor="#1c0207" />
            </linearGradient>

            <linearGradient id="monolithRightInner" x1="285" y1="120" x2="265" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#58081f" />
              <stop offset="100%" stopColor="#1c0207" />
            </linearGradient>

            <linearGradient id="monolithRightBevel" x1="380" y1="70" x2="345" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#881337" />
              <stop offset="100%" stopColor="#2b030b" />
            </linearGradient>

            {/* 3. The Luminous Horizon Breakthrough (Opening into the Future) */}
            <radialGradient id="horizonGlow" cx="250" cy="235" r="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="22%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="48%" stopColor="#f59e0b" stopOpacity="0.65" />
              <stop offset="75%" stopColor="#e11d48" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
            </radialGradient>

            {/* 4. Cyan Precision Accents (Optimum Benchmark Identity) */}
            <linearGradient id="cyanAccentLeft" x1="125" y1="60" x2="160" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#0369a1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="cyanAccentRight" x1="375" y1="60" x2="340" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#0369a1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>

            {/* 5. Converging Reflective Pathway (Pathway to Success) */}
            <linearGradient id="pathwayFloorGrad" x1="250" y1="230" x2="250" y2="465" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="18%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#e11d48" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#4c0519" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
            </linearGradient>

            {/* 6. Precision Architectural Linework */}
            <linearGradient id="archLineGrad" x1="250" y1="50" x2="250" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
              <stop offset="50%" stopColor="rgba(244, 63, 94, 0.45)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.3)" />
            </linearGradient>

            {/* 7. Portal Aperture Halo */}
            <linearGradient id="portalRimGrad" x1="210" y1="70" x2="290" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* ================= LAYER 1: HORIZON & SUNRISE BREAKTHROUGH ================= */}
          {/* Radiant Sky Backdrop Through Portal */}
          <ellipse cx="250" cy="235" rx="90" ry="120" fill="url(#horizonGlow)" opacity="0.9" />

          {/* Subtle Dawn Light Ray Shards */}
          <polygon points="250,235 210,130 220,120" fill="#fef08a" opacity="0.25" />
          <polygon points="250,235 285,115 295,125" fill="#fef08a" opacity="0.25" />
          <polygon points="250,235 250,90 255,90" fill="#ffffff" opacity="0.4" />

          {/* Deep Architectural Horizon Threshold Bar */}
          <line x1="180" y1="248" x2="320" y2="248" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />
          <circle cx="250" cy="248" r="3.5" fill="#ffffff" />
          <circle cx="250" cy="248" r="7" fill="#f59e0b" opacity="0.4" />

          {/* ================= LAYER 2: CONVERGING LIGHT PATHWAY / REFLECTIVE FLOOR ================= */}
          {/* Main Trapezoid Pathway leading inward */}
          <polygon
            points="218,248 282,248 375,465 125,465"
            fill="url(#pathwayFloorGrad)"
          />

          {/* Centered Guide Ray & Runway Telemetry Marks */}
          <line x1="250" y1="248" x2="250" y2="465" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeDasharray="10 6" />
          <line x1="230" y1="310" x2="270" y2="310" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
          <line x1="205" y1="375" x2="295" y2="375" stroke="#f43f5e" strokeWidth="1.2" opacity="0.45" />
          <line x1="170" y1="435" x2="330" y2="435" stroke="#38bdf8" strokeWidth="1.2" opacity="0.4" />

          {/* Outer Pathway Perspective Rails */}
          <line x1="218" y1="248" x2="125" y2="465" stroke="#38bdf8" strokeWidth="1.2" opacity="0.55" />
          <line x1="282" y1="248" x2="375" y2="465" stroke="#38bdf8" strokeWidth="1.2" opacity="0.55" />

          {/* ================= LAYER 3: SCULPTURAL ARCHITECTURAL MONOLITHS ================= */}

          {/* --- LEFT MONOLITH COLUMN --- */}
          {/* Left Monolith: Outer Structural Bevel */}
          <polygon
            points="125,70 162,55 185,385 140,400"
            fill="url(#monolithLeftBevel)"
            stroke="url(#archLineGrad)"
            strokeWidth="0.8"
          />

          {/* Left Monolith: Main Monumental Facet */}
          <polygon
            points="162,55 212,85 228,375 185,385"
            fill="url(#monolithLeftFront)"
            stroke="url(#archLineGrad)"
            strokeWidth="1"
          />

          {/* Left Monolith: Inner Portal Return Face (Facing the Light) */}
          <polygon
            points="212,85 225,100 236,370 228,375"
            fill="url(#monolithLeftInner)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
          />

          {/* Left Monolith: Cyan Precision Edge Bevel */}
          <line x1="125" y1="70" x2="140" y2="400" stroke="url(#cyanAccentLeft)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="162" y1="55" x2="185" y2="385" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* --- RIGHT MONOLITH COLUMN (Asymmetrical Sculptural Counterpart) --- */}
          {/* Right Monolith: Outer Structural Bevel */}
          <polygon
            points="375,70 338,55 315,385 360,400"
            fill="url(#monolithRightBevel)"
            stroke="url(#archLineGrad)"
            strokeWidth="0.8"
          />

          {/* Right Monolith: Main Monumental Facet */}
          <polygon
            points="338,55 288,85 272,375 315,385"
            fill="url(#monolithRightFront)"
            stroke="url(#archLineGrad)"
            strokeWidth="1"
          />

          {/* Right Monolith: Inner Portal Return Face (Facing the Light) */}
          <polygon
            points="288,85 275,100 264,370 272,375"
            fill="url(#monolithRightInner)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
          />

          {/* Right Monolith: Cyan Precision Edge Bevel */}
          <line x1="375" y1="70" x2="360" y2="400" stroke="url(#cyanAccentRight)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="338" y1="55" x2="315" y2="385" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* ================= LAYER 4: UPPER ARCHITECTURAL LINTEL / HORIZON NEXUS ================= */}
          {/* Ethereal Transom / Portal Aperture Beam */}
          <polygon
            points="212,85 225,100 275,100 288,85 250,70"
            fill="#be123c"
            stroke="url(#portalRimGrad)"
            strokeWidth="1"
            opacity="0.85"
          />

          {/* Focal Pinnacle Glimmer */}
          <circle cx="250" cy="70" r="2.5" fill="#ffffff" />
          <circle cx="250" cy="70" r="6" fill="#f43f5e" opacity="0.3" />

          {/* ================= LAYER 5: EDITORIAL TELEMETRY & SUBTLE AESTHETICS ================= */}
          {/* Minimal Coordinate and Portal Marks */}
          <g opacity="0.6">
            <circle cx="125" cy="70" r="2" fill="#38bdf8" />
            <circle cx="375" cy="70" r="2" fill="#38bdf8" />
            <circle cx="140" cy="400" r="2" fill="#e11d48" />
            <circle cx="360" cy="400" r="2" fill="#e11d48" />
          </g>

          {/* Clean Technical Axis Reticles */}
          <g opacity="0.35">
            <line x1="60" y1="248" x2="100" y2="248" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="400" y1="248" x2="440" y2="248" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="80" y1="238" x2="80" y2="258" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="420" y1="238" x2="420" y2="258" stroke="#ffffff" strokeWidth="0.8" />
          </g>

          {/* Discrete Portal Identification Text */}
          <text
            x="250"
            y="488"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.4)"
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.25em"
            fontFamily="monospace"
          >
            OPTIMUM GATEWAY // A NEW LEVEL OF POSSIBILITY
          </text>
        </svg>
      </div>
    </div>
  );
}
