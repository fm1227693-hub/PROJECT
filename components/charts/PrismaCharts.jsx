"use client";

/**
 * Every chart in the product lives here so the whole module (and Recharts) can
 * be code-split and loaded only on data screens — see components/charts/index.js.
 *
 * Rules: entrance animation once, no loops, hairline grid, muted palette,
 * legible at 320px wide.
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TONE_CLASSES } from "@/lib/data/brand";

const AXIS = {
  stroke: "#9aa2b1",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const GRID = { stroke: "#e7e4dc", strokeDasharray: "3 4", vertical: false };

export const scoreColour = (value) => (value >= 80 ? "#14855c" : value >= 60 ? "#b8791a" : "#bf4a3f");

function ChartTooltip({ active, payload, label, suffix = "%", unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 shadow-md">
      {label !== undefined ? (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      ) : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-[12.5px]">
            <span className="size-2 shrink-0 rounded-full" style={{ background: entry.color ?? entry.stroke ?? entry.fill }} aria-hidden="true" />
            <span className="text-muted">{entry.name}</span>
            <span className="tnum ml-auto font-semibold text-ink">
              {typeof entry.value === "number" ? Math.round(entry.value * 10) / 10 : entry.value}
              {unit ?? suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const animateOnce = { isAnimationActive: true, animationDuration: 850, animationEasing: "ease-out" };

/* ------------------------------------------------------------------ *
 * Trend — overall scores across attempts
 * ------------------------------------------------------------------ */

export function TrendChart({ data = [], keys = [{ key: "math", name: "Mathematics", color: "#2b4fe0" }, { key: "english", name: "English", color: "#7a5cd6" }], height = 260, area = true, xKey = "label" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          {keys.map((k) => (
            <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={k.color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={k.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...GRID} />
        <XAxis dataKey={xKey} {...AXIS} dy={6} />
        <YAxis domain={[0, 100]} {...AXIS} tickFormatter={(v) => `${v}`} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#dcd8ce", strokeWidth: 1 }} />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 11.5, color: "#6d7789", paddingBottom: 4 }}
        />
        {keys.map((k) =>
          area ? (
            <Area key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color} strokeWidth={2} fill={`url(#grad-${k.key})`} dot={{ r: 2.5, fill: k.color, strokeWidth: 0 }} activeDot={{ r: 4 }} {...animateOnce} />
          ) : (
            <Line key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color} strokeWidth={2} dot={{ r: 2.5, fill: k.color, strokeWidth: 0 }} activeDot={{ r: 4 }} {...animateOnce} />
          ),
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Topic bars — horizontal, colour-coded by mastery band
 * ------------------------------------------------------------------ */

export function TopicBars({ data = [], height, barSize = 12, showAxis = true, valueKey = "score", nameKey = "name" }) {
  const computedHeight = height ?? Math.max(180, data.length * 30 + 24);
  return (
    <ResponsiveContainer width="100%" height={computedHeight}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: showAxis ? 8 : 0 }} barCategoryGap="28%">
        {showAxis ? <XAxis type="number" domain={[0, 100]} {...AXIS} width={34} /> : <XAxis type="number" domain={[0, 100]} hide />}
        <YAxis
          type="category"
          dataKey={nameKey}
          {...AXIS}
          width={118}
          interval={0}
          tick={{ ...AXIS, fontSize: 11.5, fill: "#46536e" }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,24,43,0.035)" }} />
        <Bar dataKey={valueKey} name="Mastery" radius={[0, 3, 3, 0]} barSize={barSize} {...animateOnce}>
          {data.map((entry) => (
            <Cell key={entry[nameKey]} fill={entry.color ?? scoreColour(entry[valueKey])} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Cohort bars — vertical, used for classes, year groups, distributions
 * ------------------------------------------------------------------ */

export function CohortBars({ data = [], height = 240, keys = [{ key: "value", name: "Score", color: "#2b4fe0" }], xKey = "label", bandColour = false, barSize = 22 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }} barCategoryGap="30%">
        <CartesianGrid {...GRID} />
        <XAxis dataKey={xKey} {...AXIS} dy={6} interval={0} tick={{ ...AXIS, fontSize: 10.5 }} />
        <YAxis domain={[0, 100]} {...AXIS} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,24,43,0.035)" }} />
        {keys.length > 1 ? (
          <Legend verticalAlign="top" align="right" height={26} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11.5 }} />
        ) : null}
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color} radius={[3, 3, 0, 0]} barSize={barSize} {...animateOnce}>
            {bandColour
              ? data.map((entry, i) => <Cell key={`${k.key}-${i}`} fill={scoreColour(entry[k.key])} />)
              : null}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Skill radar — two snapshots or two subjects on one shape
 * ------------------------------------------------------------------ */

export function SkillRadar({ data = [], series = [], height = 300, domain = [0, 100] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%" margin={{ top: 12, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="#e7e4dc" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#46536e" }} />
        <PolarRadiusAxis domain={domain} tick={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.name}
            dataKey={s.key}
            stroke={s.color}
            fill={s.color}
            fillOpacity={s.opacity ?? 0.14}
            strokeWidth={2}
            {...animateOnce}
          />
        ))}
        {series.length > 1 ? (
          <Legend verticalAlign="bottom" height={26} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11.5 }} />
        ) : null}
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Weekly minutes — compact bars for the streak / activity card
 * ------------------------------------------------------------------ */

export function WeeklyBars({ data = [], height = 92, color = "#2b4fe0", xKey = "day", valueKey = "minutes", target }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="34%">
        <XAxis dataKey={xKey} {...AXIS} dy={2} tick={{ ...AXIS, fontSize: 10 }} />
        <YAxis hide domain={[0, (max) => Math.max(max, target ?? 0) * 1.15]} />
        {target ? (
          <CartesianGrid {...GRID} horizontal={false} />
        ) : null}
        <Tooltip content={<ChartTooltip unit=" min" suffix="" />} cursor={{ fill: "rgba(16,24,43,0.035)" }} />
        <Bar dataKey={valueKey} name="Study time" fill={color} radius={[2, 2, 0, 0]} {...animateOnce}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.minutes >= (target ?? Infinity) ? TONE_CLASSES.strong.stroke : color} fillOpacity={entry.minutes ? 1 : 0.25} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Sparkline — tiny trend marker used inside tables
 * ------------------------------------------------------------------ */

export function Sparkline({ data = [], dataKey = "value", color = "#2b4fe0", width = 96, height = 28 }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.6} dot={false} {...animateOnce} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Term comparison — grouped bars for school analytics
 * ------------------------------------------------------------------ */

export function TermComparison({ data = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }} barGap={4}>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="term" {...AXIS} dy={6} tick={{ ...AXIS, fontSize: 11 }} />
        <YAxis domain={[0, 100]} {...AXIS} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,24,43,0.035)" }} />
        <Legend verticalAlign="top" align="right" height={26} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11.5 }} />
        <Bar dataKey="math" name="Mathematics" fill="#2b4fe0" radius={[3, 3, 0, 0]} barSize={18} {...animateOnce} />
        <Bar dataKey="english" name="English" fill="#7a5cd6" radius={[3, 3, 0, 0]} barSize={18} {...animateOnce} />
      </BarChart>
    </ResponsiveContainer>
  );
}
