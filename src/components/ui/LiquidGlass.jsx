import React from 'react';

/**
 * LiquidGlassSurface
 * High-performance, luxury translucent surface with customizable variants.
 */
export function LiquidGlassSurface({
  children,
  variant = 'elevated',
  className = '',
  as: Component = 'div',
  glow = false,
  ...props
}) {
  const variantStyles = {
    subtle: 'bg-white/40 dark:bg-[#070b14]/50 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] shadow-xs',
    elevated: 'bg-white/70 dark:bg-[#090f1d]/75 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xl shadow-black/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
    interactive: 'bg-white/60 dark:bg-[#070b14]/65 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40 dark:hover:border-red-500/50 hover:bg-white/80 dark:hover:bg-[#0c1424]/80 shadow-md hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300',
    accent: 'bg-gradient-to-br from-red-600/10 via-rose-600/5 to-transparent dark:from-red-600/15 dark:via-rose-600/5 dark:to-[#070b14]/80 backdrop-blur-2xl border border-red-500/25 dark:border-red-500/30 shadow-xl shadow-red-500/10',
    highContrast: 'bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg',
    dock: 'bg-slate-200/80 dark:bg-[#070b14]/90 border border-slate-300/80 dark:border-white/10 backdrop-blur-2xl shadow-lg'
  };

  return (
    <Component
      className={`relative ${variantStyles[variant] || variantStyles.elevated} ${className}`}
      {...props}
    >
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent pointer-events-none" />
      )}
      {children}
    </Component>
  );
}

/**
 * LiquidGlassBadge
 * Status, category, or phase indicator badge with luminous glass aura.
 */
export function LiquidGlassBadge({
  children,
  variant = 'brand',
  dot = true,
  className = '',
  ...props
}) {
  const variantStyles = {
    brand: 'bg-red-50/90 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200/80 dark:border-red-900/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    emerald: 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    sky: 'bg-sky-50/90 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-900/40',
    amber: 'bg-amber-50/90 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/40',
    neutral: 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
  };

  const dotColors = {
    brand: 'bg-red-500',
    emerald: 'bg-emerald-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    neutral: 'bg-slate-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md border ${variantStyles[variant] || variantStyles.brand} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-red-500'} animate-pulse shrink-0`} />
      )}
      <span>{children}</span>
    </span>
  );
}

/**
 * LiquidGlassButton
 * High-conversion tactile button supporting primary gradient or glass variants.
 */
export function LiquidGlassButton({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black shadow-lg shadow-red-600/30 hover:shadow-red-600/40 border border-white/20 hover:-translate-y-0.5 active:translate-y-0',
    glass: 'bg-white/60 dark:bg-white/[0.05] hover:bg-white/80 dark:hover:bg-white/[0.1] text-slate-900 dark:text-white font-bold border border-slate-300/80 dark:border-white/15 backdrop-blur-xl shadow-sm hover:border-red-500/40 hover:-translate-y-0.5 active:translate-y-0',
    subtle: 'bg-transparent hover:bg-white/40 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-semibold'
  };

  return (
    <Component
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 cursor-pointer select-none ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * LiquidGlassInput
 * Premium form input with glass backdrop and focused crimson glow halo.
 */
export function LiquidGlassInput({
  className = '',
  ...props
}) {
  return (
    <input
      className={`w-full px-4 py-3.5 rounded-2xl bg-white/70 dark:bg-[#070b14]/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 backdrop-blur-xl focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm font-medium ${className}`}
      {...props}
    />
  );
}
