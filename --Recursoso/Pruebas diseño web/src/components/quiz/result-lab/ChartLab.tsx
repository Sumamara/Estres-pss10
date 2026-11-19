"use client";

/* ── Laboratorio de gráficos del resultado ──
   6 iteraciones del gráfico principal con el mismo perfil, para comparar lado a lado. */

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { ResultModel } from "./model";

/* ───────────── utilidades ───────────── */

const prefersReduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Número que sube de 0 al valor con ease-out.
 *  round = false devuelve el valor continuo (para mover arcos y punteros sin saltos). */
function useCountUp(value: number, duration = 1200, delay = 250, round = true) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (prefersReduced()) {
            setN(value);
            return;
        }
        let raf = 0;
        const t = setTimeout(() => {
            const start = performance.now();
            const step = (now: number) => {
                const p = Math.min(1, (now - start) / duration);
                const v = value * (1 - Math.pow(1 - p, 4));
                setN(round ? Math.round(v) : v);
                if (p < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        }, delay);
        return () => {
            clearTimeout(t);
            cancelAnimationFrame(raf);
        };
    }, [value, duration, delay, round]);
    return n;
}

/** Punto sobre un semicírculo (u = 0 izquierda, 1 derecha) */
const polar = (cx: number, cy: number, r: number, u: number) => {
    const th = Math.PI * (1 - Math.max(0, Math.min(1, u)));
    return { x: cx + r * Math.cos(th), y: cy - r * Math.sin(th) };
};
const arcPath = (cx: number, cy: number, r: number, u0: number, u1: number) => {
    const a = polar(cx, cy, r, u0);
    const b = polar(cx, cy, r, u1);
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

/* ───────────── A · Medidor original (tacómetro) ───────────── */

function GaugeOriginal({ m }: { m: ResultModel }) {
    const CX = 150, CY = 138, R = 112, STROKE = 28;
    const u = m.score / 100;
    const needle = polar(CX, CY, 84, u);
    const dividers = [0.25, 0.5, 0.75].map((d) => ({
        inner: polar(CX, CY, R - STROKE / 2 - 6, d),
        outer: polar(CX, CY, R + STROKE / 2 + 6, d),
    }));
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 165" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke="#efece6" strokeWidth={STROKE} />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={STROKE} />}
                {dividers.map((d, i) => (
                    <line key={i} x1={d.inner.x} y1={d.inner.y} x2={d.outer.x} y2={d.outer.y} stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
                ))}
                <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
                <circle cx={CX} cy={CY} r="8" fill="#fff" stroke="#1f2937" strokeWidth="4.5" />
                <text x={CX - R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">0</text>
                <text x={CX + R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">100</text>
            </svg>
            <p className="text-center mt-2">
                <span className="text-5xl font-black tabular-nums">{m.score}</span>
                <span className="text-xl font-bold text-muted-foreground ml-1.5">/ 100</span>
            </p>
        </div>
    );
}

/* ───────────── D · Medidor original refinado (impeccable) ───────────── */

export function GaugeImpeccable({ m }: { m: ResultModel }) {
    const CX = 150, CY = 150, R = 118, W = 16;
    const shown = useCountUp(m.score);
    const marker = polar(CX, CY, R, shown / 100);
    const gap = 0.012;
    return (
        <div className="w-full max-w-[320px] mx-auto">
            <svg viewBox="0 0 300 200" className="w-full h-auto overflow-visible" role="img" aria-label={`Balance ${m.score} de 100, zona ${m.zoneTitle}`}>
                {m.zones.map((z, i) => {
                    const active = z.key === m.zoneKey;
                    return (
                        <path
                            key={z.key}
                            d={arcPath(CX, CY, R, i / 4 + (i ? gap : 0), (i + 1) / 4 - (i < 3 ? gap : 0))}
                            fill="none"
                            stroke={z.hex}
                            strokeOpacity={active ? 1 : 0.22}
                            strokeWidth={W}
                            strokeLinecap="round"
                        />
                    );
                })}
                {/* Marcador: un punto sobre el arco, no una aguja */}
                <circle cx={marker.x} cy={marker.y} r={W / 2 + 5} fill="#fff" stroke="hsl(var(--foreground))" strokeWidth="3" />
                <circle cx={marker.x} cy={marker.y} r="3.5" fill="hsl(var(--foreground))" />

                <text x={CX} y={CY - 26} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Outfit, sans-serif", fontSize: 56, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
                <text x={CX} y={CY - 2} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 14, fontWeight: 500 }}>
                    de 100
                </text>
                <text x={CX - R - W / 2} y={CY + 28} textAnchor="start" className="fill-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                    Más recuperación
                </text>
                <text x={CX + R + W / 2} y={CY + 28} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                    Más desgaste
                </text>
            </svg>
            <p className="text-center text-2xl font-bold tracking-tight -mt-1" style={{ color: m.zoneInk, fontFamily: "Outfit, sans-serif" }}>
                {m.zoneTitle}
            </p>
        </div>
    );
}

/* ───────────── H · Tacómetro con más carácter ─────────────
   Como el original, pero con escala graduada, banda de zonas, aguja afinada que
   barre desde 0 con un leve rebote, y un visor tipo tablero con el número. */

function GaugeTacho({ m }: { m: ResultModel }) {
    const CX = 150, CY = 150, R = 118;
    const [angle, setAngle] = useState(-180);
    const shown = useCountUp(m.score, 1500, 300);
    useEffect(() => {
        const target = -180 + 180 * (m.score / 100);
        if (prefersReduced()) {
            setAngle(target);
            return;
        }
        setAngle(-180);
        const t = setTimeout(() => setAngle(target), 300);
        return () => clearTimeout(t);
    }, [m.score]);

    const fg = "hsl(var(--foreground))";
    const ticks = Array.from({ length: 21 }, (_, i) => i * 5);
    const at = (v: number, r: number) => polar(CX, CY, r, v / 100);

    return (
        <div className="w-full max-w-[320px] mx-auto">
            <svg viewBox="0 0 300 215" className="w-full h-auto overflow-visible" role="img" aria-label={`Tacómetro: ${m.score} de 100, zona ${m.zoneTitle}`}>
                {/* Cara del tablero */}
                <path d={`${arcPath(CX, CY, R + 10, 0, 1)} Z`} fill={fg} fillOpacity="0.035" />
                {/* Banda de zonas */}
                {m.zones.map((z, i) => (
                    <path
                        key={z.key}
                        d={arcPath(CX, CY, R + 4, i / 4, (i + 1) / 4)}
                        fill="none"
                        stroke={z.hex}
                        strokeOpacity={z.key === m.zoneKey ? 1 : 0.3}
                        strokeWidth="7"
                    />
                ))}
                {/* Escala */}
                {ticks.map((v) => {
                    const major = v % 20 === 0;
                    const a = at(v, R - 2), b = at(v, R - (major ? 16 : 9));
                    return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fg} strokeOpacity={major ? 0.85 : 0.4} strokeWidth={major ? 2.5 : 1.3} strokeLinecap="round" />;
                })}
                {ticks.filter((v) => v % 20 === 0).map((v) => {
                    const p = at(v, R - 30);
                    return (
                        <text key={v} x={p.x} y={p.y + 4} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11.5, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            {v}
                        </text>
                    );
                })}

                {/* Aguja afinada */}
                <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform 1600ms cubic-bezier(0.34, 1.35, 0.64, 1)" }}>
                    <path d={`M ${CX - 16} ${CY - 3.5} L ${CX + R - 22} ${CY - 0.8} L ${CX + R - 22} ${CY + 0.8} L ${CX - 16} ${CY + 3.5} Z`} fill={m.zoneInk} />
                </g>
                <circle cx={CX} cy={CY} r="11" fill={fg} />
                <circle cx={CX} cy={CY} r="4" fill={m.zoneHex} />

                {/* Visor */}
                <rect x={CX - 44} y={CY + 20} width="88" height="40" rx="8" fill={fg} />
                <text x={CX - 6} y={CY + 49} textAnchor="end" fill="#fff" style={{ fontFamily: "Outfit, sans-serif", fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
                <text x={CX} y={CY + 47} fill="#fff" fillOpacity="0.7" style={{ fontSize: 12, fontWeight: 500 }}>
                    de 100
                </text>
            </svg>
            <p className="text-center text-xl font-bold -mt-1" style={{ color: m.zoneInk, fontFamily: "Outfit, sans-serif" }}>
                {m.zoneTitle}
            </p>
        </div>
    );
}

/* ───────────── I · Medidor sobrio de rayas ─────────────
   Monocromo: 51 rayas en semicírculo que se van marcando hasta tu valor.
   El único color es la raya de tu resultado. */

function GaugeSober({ m }: { m: ResultModel }) {
    const CX = 150, CY = 156;
    const shown = useCountUp(m.score, 1300, 250);
    const fg = "hsl(var(--foreground))";
    const steps = Array.from({ length: 51 }, (_, i) => i * 2);
    const markV = Math.round(m.score / 2) * 2;

    return (
        <div className="w-full max-w-[320px] mx-auto">
            <svg viewBox="0 0 300 185" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100, zona ${m.zoneTitle}`}>
                {steps.map((v) => {
                    const isMark = v === markV && shown >= m.score;
                    const quarter = v % 25 === 0;
                    const r1 = isMark ? 92 : quarter ? 100 : 104;
                    const r2 = isMark ? 130 : quarter ? 124 : 120;
                    const a = polar(CX, CY, r1, v / 100), b = polar(CX, CY, r2, v / 100);
                    const on = v <= shown;
                    return (
                        <line
                            key={v}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={isMark ? m.zoneInk : fg}
                            strokeOpacity={isMark ? 1 : on ? 0.8 : 0.14}
                            strokeWidth={isMark ? 3.5 : quarter ? 2 : 1.4}
                            strokeLinecap="round"
                        />
                    );
                })}
                {[0, 25, 50, 75, 100].map((v) => {
                    const p = polar(CX, CY, 84, v / 100);
                    return (
                        <text key={v} x={p.x} y={p.y + 4} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10.5, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                            {v}
                        </text>
                    );
                })}
                <text x={CX} y={CY - 14} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Inter, sans-serif", fontSize: 50, fontWeight: 400, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
                <text x={CX} y={CY + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                    de 100
                </text>
            </svg>
            <div className="flex items-center justify-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.zoneHex }} aria-hidden="true" />
                <span className="text-base font-semibold text-foreground">{m.zoneTitle}</span>
            </div>
        </div>
    );
}

/* ───────────── Nuevas iteraciones cercanas al A ─────────────
   Misma geometría del medidor original (arco grueso de 28, aguja central),
   cambiando un elemento a la vez para ver qué gusta. */

const AG = { CX: 150, CY: 138, R: 112, S: 28 };
const TRACK = "#efece6";
const DARK = "#1f2937";

/** Número grande solo, sin "/ 100" */
const BigNumber = ({ n, zone, ink }: { n: number; zone?: string; ink?: string }) => (
    <div className="text-center mt-2">
        <p className="text-5xl font-black tracking-tight tabular-nums leading-none">{n}</p>
        {zone && (
            <p className="mt-2 text-lg font-bold" style={{ color: ink, fontFamily: "Outfit, sans-serif" }}>
                {zone}
            </p>
        )}
    </div>
);

/* J · El A con divisores cortos (solo dentro del arco) y un solo número */
function GaugeJ({ m }: { m: ResultModel }) {
    const { CX, CY, R, S } = AG;
    const shown = useCountUp(m.score);
    const u = shown / 100;
    const needle = polar(CX, CY, 84, u);
    const divs = [0.25, 0.5, 0.75].map((d) => ({ a: polar(CX, CY, R - S / 2 + 5, d), b: polar(CX, CY, R + S / 2 - 5, d) }));
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 165" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} />}
                {divs.map((d, i) => (
                    <line key={i} x1={d.a.x} y1={d.a.y} x2={d.b.x} y2={d.b.y} stroke="#3f3f46" strokeWidth="2.5" strokeLinecap="round" />
                ))}
                <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke={DARK} strokeWidth="4" strokeLinecap="round" />
                <circle cx={CX} cy={CY} r="8" fill="#fff" stroke={DARK} strokeWidth="4.5" />
                <text x={CX - R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">0</text>
                <text x={CX + R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">100</text>
            </svg>
            <BigNumber n={shown} />
        </div>
    );
}

/* K · Las 4 zonas siempre a color (la tuya encendida), aguja afinada y la zona escrita */
export function GaugeK({ m, showZone = true }: { m: ResultModel; showZone?: boolean }) {
    const { CX, CY, R, S } = AG;
    const shown = useCountUp(m.score);
    const u = shown / 100;
    const tip = polar(CX, CY, R - S / 2 - 6, u);
    const ang = Math.PI * (1 - u);
    const nx = Math.sin(ang) * 4, ny = Math.cos(ang) * 4; // perpendicular para la base de la aguja
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 165" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100, zona ${m.zoneTitle}`}>
                {m.zones.map((z, i) => (
                    <path key={z.key} d={arcPath(CX, CY, R, i / 4, (i + 1) / 4)} fill="none" stroke={z.hex} strokeOpacity={z.key === m.zoneKey ? 1 : 0.28} strokeWidth={S} />
                ))}
                {[0.25, 0.5, 0.75].map((d) => {
                    const a = polar(CX, CY, R - S / 2, d), b = polar(CX, CY, R + S / 2, d);
                    return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="hsl(var(--card))" strokeWidth="3" />;
                })}
                <path d={`M ${CX + nx} ${CY + ny} L ${tip.x} ${tip.y} L ${CX - nx} ${CY - ny} Z`} fill={DARK} />
                <circle cx={CX} cy={CY} r="9" fill={DARK} />
                <circle cx={CX} cy={CY} r="3.5" fill="#fff" />
                <text x={CX - R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">0</text>
                <text x={CX + R} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-bold">100</text>
            </svg>
            <BigNumber n={shown} zone={showZone ? m.zoneTitle : undefined} ink={m.zoneInk} />
        </div>
    );
}

/* L · Sin aguja: el arco se llena hasta una perilla, número adentro del arco y rayitas de escala */
function GaugeL({ m }: { m: ResultModel }) {
    const { CX, CY, R, S } = AG;
    const shown = useCountUp(m.score);
    const u = shown / 100;
    const knob = polar(CX, CY, R, u);
    const ticks = Array.from({ length: 11 }, (_, i) => i / 10);
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 165" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100, zona ${m.zoneTitle}`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} strokeLinecap="round" />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} strokeLinecap="round" />}
                {ticks.map((t) => {
                    const major = Math.round(t * 100) % 25 === 0;
                    const a = polar(CX, CY, R - S / 2 - 7, t);
                    const b2 = polar(CX, CY, R - S / 2 - (major ? 16 : 11), t);
                    return <line key={t} x1={a.x} y1={a.y} x2={b2.x} y2={b2.y} stroke={DARK} strokeOpacity={major ? 0.55 : 0.25} strokeWidth={major ? 2 : 1.3} strokeLinecap="round" />;
                })}
                <circle cx={knob.x} cy={knob.y} r={S / 2 + 2} fill="#fff" stroke={m.zoneHex} strokeWidth="4" />
                <text x={CX} y={CY - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 50, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
                <text x={CX} y={CY + 18} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fontFamily: "Outfit, sans-serif" }} fill={m.zoneInk}>
                    {m.zoneTitle}
                </text>
            </svg>
        </div>
    );
}

/* M · Arco del A + escala graduada por fuera (0·25·50·75·100) y un puntero triangular en lugar de aguja */
function GaugeM({ m }: { m: ResultModel }) {
    const CX = 150, CY = 160, R = 100, S = 24;
    const shown = useCountUp(m.score);
    const u = shown / 100;
    const ticks = Array.from({ length: 21 }, (_, i) => i * 5);
    const tipP = polar(CX, CY, R - S / 2 - 3, u);
    const baseL = polar(CX, CY, R - S / 2 - 17, u - 0.03);
    const baseR = polar(CX, CY, R - S / 2 - 17, u + 0.03);
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 190" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} />}
                {ticks.map((v) => {
                    const major = v % 25 === 0;
                    const a = polar(CX, CY, R + S / 2 + 4, v / 100), b = polar(CX, CY, R + S / 2 + (major ? 14 : 9), v / 100);
                    return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={DARK} strokeOpacity={major ? 0.75 : 0.3} strokeWidth={major ? 2 : 1.2} strokeLinecap="round" />;
                })}
                {[0, 25, 50, 75, 100].map((v) => {
                    const p = polar(CX, CY, R + S / 2 + 26, v / 100);
                    return (
                        <text key={v} x={p.x} y={p.y + 4} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
                            {v}
                        </text>
                    );
                })}
                <path d={`M ${tipP.x} ${tipP.y} L ${baseL.x} ${baseL.y} L ${baseR.x} ${baseR.y} Z`} fill={DARK} />
                <text x={CX} y={CY - 6} textAnchor="middle" className="fill-foreground" style={{ fontSize: 48, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
            </svg>
            <p className="text-center text-lg font-bold -mt-1" style={{ color: m.zoneInk, fontFamily: "Outfit, sans-serif" }}>
                {m.zoneTitle}
            </p>
        </div>
    );
}

/* ───────────── N · O · P: variantes del M sin escala exterior ─────────────
   N: divisores negros apenas más largos que el ancho del arco.
   O: igual, pero los divisores son espacios entre secciones (como el K).
   P: divisores negros como N, y cada sección con el color de su zona. */

function GaugeMClean({ m, mode }: { m: ResultModel; mode: "N" | "O" | "P" | "Q" }) {
    const CX = 150, CY = 150, R = 110, S = 26;
    const shown = useCountUp(m.score);
    const u = shown / 100;
    const tipP = polar(CX, CY, R - S / 2 - 3, u);
    const baseL = polar(CX, CY, R - S / 2 - 17, u - 0.03);
    const baseR = polar(CX, CY, R - S / 2 - 17, u + 0.03);
    const cuts = [0.25, 0.5, 0.75];

    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 175" className="w-full h-auto overflow-visible" role="img" aria-label={`Medidor: ${m.score} de 100, zona ${m.zoneTitle}`}>
                {mode === "P" || mode === "Q" ? (
                    <>
                        {/* Cada sección con su color: tenue de fondo, llena hasta tu valor */}
                        {m.zones.map((z, i) => (
                            <path key={`bg-${z.key}`} d={arcPath(CX, CY, R, i / 4, (i + 1) / 4)} fill="none" stroke={z.hex} strokeOpacity="0.2" strokeWidth={S} />
                        ))}
                        {m.zones.map((z, i) => {
                            const a = i / 4, b = Math.min((i + 1) / 4, u);
                            return b > a + 0.002 ? <path key={`fg-${z.key}`} d={arcPath(CX, CY, R, a, b)} fill="none" stroke={z.hex} strokeWidth={S} /> : null;
                        })}
                    </>
                ) : (
                    <>
                        <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} />
                        {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} />}
                    </>
                )}

                {mode !== "Q" && cuts.map((d) => {
                    if (mode === "O") {
                        const a = polar(CX, CY, R - S / 2 - 1, d), b = polar(CX, CY, R + S / 2 + 1, d);
                        return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="hsl(var(--card))" strokeWidth="4" />;
                    }
                    const a = polar(CX, CY, R - S / 2 - 5, d), b = polar(CX, CY, R + S / 2 + 5, d);
                    return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={DARK} strokeWidth="3" strokeLinecap="round" />;
                })}

                <path d={`M ${tipP.x} ${tipP.y} L ${baseL.x} ${baseL.y} L ${baseR.x} ${baseR.y} Z`} fill={DARK} />
                <text x={CX} y={CY - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 50, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                    {shown}
                </text>
            </svg>
            <p className="text-center text-lg font-bold -mt-1" style={{ color: m.zoneInk, fontFamily: "Outfit, sans-serif" }}>
                {m.zoneTitle}
            </p>
        </div>
    );
}

/* ───────────── R · Propuesta: lo mejor de cada uno ─────────────
   - Del A: la aguja con su eje (lo que más te gustó).
   - Del P/Q: cada zona con su color, llena hasta tu valor; lo que sigue, tenue.
   - Del O: secciones separadas por un espacio limpio (sin rayas que compitan).
   - Del J: un solo número, sin "/ 100", y el nombre de la zona debajo.
   Los extremos dicen qué significan, para que el número se entienda solo. */

function GaugeR({ m }: { m: ResultModel }) {
    const CX = 150, CY = 140, R = 110, S = 22;
    const shown = useCountUp(m.score, 1300, 250);
    const u = shown / 100;
    const gap = 0.008;
    const needle = polar(CX, CY, R - S / 2 - 12, u);

    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox="0 0 300 172" className="w-full h-auto overflow-visible" role="img" aria-label={`Nivel de desgaste: ${m.score} de 100, zona ${m.zoneTitle}`}>
                {m.zones.map((z, i) => {
                    const a = i / 4 + (i ? gap : 0);
                    const b = (i + 1) / 4 - (i < 3 ? gap : 0);
                    const fillTo = Math.min(b, u);
                    return (
                        <g key={z.key}>
                            <path d={arcPath(CX, CY, R, a, b)} fill="none" stroke={z.hex} strokeOpacity="0.18" strokeWidth={S} />
                            {fillTo > a + 0.002 && <path d={arcPath(CX, CY, R, a, fillTo)} fill="none" stroke={z.hex} strokeWidth={S} />}
                        </g>
                    );
                })}
                <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke={DARK} strokeWidth="4" strokeLinecap="round" />
                <circle cx={CX} cy={CY} r="9" fill="#fff" stroke={DARK} strokeWidth="4.5" />
                <text x={CX - R - S / 2} y={CY + 26} textAnchor="start" className="fill-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                    Más recuperación
                </text>
                <text x={CX + R + S / 2} y={CY + 26} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                    Más desgaste
                </text>
            </svg>
            <BigNumber n={shown} zone={m.zoneTitle} ink={m.zoneInk} />
        </div>
    );
}

/* ───────────── S · N con divisores iguales de 31 y "de 100" ─────────────
   Como el N: arco de 26 de ancho, puntero triangular por dentro.
   Los 3 divisores miden lo mismo (31, apenas más que el arco) y bajo el número va "de 100". */

export function GaugeS({ m, showZone = true, tight = false }: { m: ResultModel; showZone?: boolean; tight?: boolean }) {
    const CX = 150, CY = 150, R = 110, S = 26;
    // En "En preparación" (tight) las líneas apenas asoman del arco; en el laboratorio miden 31.
    const DIV = tight ? 26 : 31;
    const DIV_W = tight ? 3.5 : 3;
    // Arco y puntero avanzan de forma continua; solo el número se redondea
    const exact = useCountUp(m.score, 1200, 250, false);
    const shown = Math.round(exact);
    const u = exact / 100;
    const ink = "hsl(var(--foreground))";
    const tipP = polar(CX, CY, R - S / 2 - 3, u);
    const baseL = polar(CX, CY, R - S / 2 - 17, u - 0.03);
    const baseR = polar(CX, CY, R - S / 2 - 17, u + 0.03);

    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox={tight ? "22 20 256 140" : "0 0 300 175"} className="w-full h-auto overflow-visible" role="img" aria-label={`${tight ? "Tu nivel de desgaste" : "Medidor"}: ${m.score} de 100, zona ${m.zoneTitle}`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} />}
                {[0.25, 0.5, 0.75].map((d) => {
                    const a = polar(CX, CY, R - DIV / 2, d), b = polar(CX, CY, R + DIV / 2, d);
                    return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeWidth={DIV_W} strokeLinecap="round" />;
                })}
                <path d={`M ${tipP.x} ${tipP.y} L ${baseL.x} ${baseL.y} L ${baseR.x} ${baseR.y} Z`} fill={ink} strokeLinejoin="round" stroke={ink} strokeWidth="1.5" />
                <text
                    x={CX}
                    y={tight ? CY - 20 : CY - 22}
                    textAnchor="middle"
                    className="fill-foreground"
                    style={{ fontFamily: "Outfit, sans-serif", fontSize: tight ? 44 : 54, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}
                >
                    {shown}
                </text>
                <text x={CX} y={CY - 2} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 15, fontWeight: 500 }}>
                    de 100
                </text>
            </svg>
            {showZone && (
                <p className="text-center text-lg font-bold -mt-1" style={{ color: m.zoneInk, fontFamily: "Outfit, sans-serif" }}>
                    {m.zoneTitle}
                </p>
            )}
        </div>
    );
}

/* ───────────── T · U: el medidor de "En preparación" con aguja ─────────────
   Mismo arco, mismas líneas de zona y mismo número (Outfit) que "En preparación".
   T usa la aguja del A (fina, con eje); U usa la del H (afinada, color de zona, rebote).
   Como la aguja sale del centro, el número baja debajo del eje para no chocar. */

export function GaugeNeedle({
    m,
    needle,
    compact = false,
    calm = false,
}: {
    m: ResultModel;
    needle: "A" | "H";
    compact?: boolean;
    /** calm: la aguja avanza junto con el arco, sin rebote; líneas de zona más finas */
    calm?: boolean;
}) {
    const CX = 150, CY = 150, R = 110, S = 26, DIV = 26;
    const ink = "hsl(var(--foreground))";
    const exact = useCountUp(m.score, 1200, 250, false);
    const shown = Math.round(exact);
    const u = exact / 100;

    // Aguja H: gira con transición y un leve rebote al llegar
    const [angle, setAngle] = useState(-180);
    useEffect(() => {
        if (needle !== "H") return;
        const target = -180 + 180 * (m.score / 100);
        if (prefersReduced()) {
            setAngle(target);
            return;
        }
        setAngle(-180);
        const t = setTimeout(() => setAngle(target), 250);
        return () => clearTimeout(t);
    }, [m.score, needle]);

    const tipA = polar(CX, CY, R - S / 2 - 12, u);
    const len = R - S / 2 - 10;

    return (
        <div className="w-full max-w-[300px] mx-auto">
            <svg viewBox={compact ? "22 20 256 194" : "22 20 256 232"} className="w-full h-auto overflow-visible" role="img" aria-label={`Tu nivel de desgaste: ${m.score} de 100, zona ${m.zoneTitle}`}>
                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke={TRACK} strokeWidth={S} />
                {u > 0.005 && <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={m.zoneHex} strokeWidth={S} />}
                {[0.25, 0.5, 0.75].map((d) => {
                    const a = polar(CX, CY, R - DIV / 2, d), b = polar(CX, CY, R + DIV / 2, d);
                    return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeWidth={calm ? 2.5 : 3.5} strokeLinecap="round" />;
                })}

                {needle === "A" ? (
                    <>
                        <line x1={CX} y1={CY} x2={tipA.x} y2={tipA.y} stroke={ink} strokeWidth="4" strokeLinecap="round" />
                        <circle cx={CX} cy={CY} r="8" fill="#fff" stroke={ink} strokeWidth="4.5" />
                    </>
                ) : (
                    <>
                        <g
                            style={
                                calm
                                    ? { transform: `rotate(${-180 + 180 * u}deg)`, transformOrigin: `${CX}px ${CY}px` }
                                    : { transform: `rotate(${angle}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform 1600ms cubic-bezier(0.34, 1.35, 0.64, 1)" }
                            }
                        >
                            <path d={`M ${CX - 9} ${CY - 3.2} L ${CX + len} ${CY - 0.8} L ${CX + len} ${CY + 0.8} L ${CX - 9} ${CY + 3.2} Z`} fill={m.zoneInk} />
                        </g>
                        <circle cx={CX} cy={CY} r="11" fill={ink} />
                        <circle cx={CX} cy={CY} r="4" fill={m.zoneHex} />
                    </>
                )}

                {/* Número y escala, justo debajo del eje (compacto: en una sola línea) */}
                {compact ? (
                    <text x={CX} y={CY + 58} textAnchor="middle">
                        <tspan
                            className="fill-foreground"
                            style={{ fontFamily: "Outfit, sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}
                        >
                            {shown}
                        </tspan>
                        <tspan dx="6" className="fill-muted-foreground" style={{ fontSize: 15, fontWeight: 500 }}>
                            de 100
                        </tspan>
                    </text>
                ) : (
                    <>
                        <text
                            x={CX}
                            y={CY + 68}
                            textAnchor="middle"
                            className="fill-foreground"
                            style={{ fontFamily: "Outfit, sans-serif", fontSize: 54, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}
                        >
                            {shown}
                        </text>
                        <text x={CX} y={CY + 90} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 15, fontWeight: 500 }}>
                            de 100
                        </text>
                    </>
                )}
            </svg>
        </div>
    );
}

/* ───────────── Página de comparación ───────────── */

const CHARTS: { id: string; title: string; note: string; render: (m: ResultModel) => JSX.Element }[] = [
    { id: "V", title: "En preparación (versión anterior)", note: "El medidor que tenía «En preparación» antes de pasar al U: número chico dentro del arco y puntero triangular.", render: (m) => <GaugeS m={m} showZone={false} tight /> },
    { id: "T", title: "En preparación + aguja del A", note: "El medidor de «En preparación» con la aguja fina del A; el número baja debajo del eje.", render: (m) => <GaugeNeedle m={m} needle="A" /> },
    { id: "U", title: "En preparación + aguja del H", note: "El medidor de «En preparación» con la aguja afinada del H (color de zona y rebote); el número baja debajo del eje.", render: (m) => <GaugeNeedle m={m} needle="H" /> },
    { id: "A", title: "Medidor original", note: "El tacómetro que está hoy en producción.", render: (m) => <GaugeOriginal m={m} /> },
    { id: "J", title: "A con divisores cortos", note: "Igual al A, pero las rayas de las zonas quedan dentro del arco y solo va el número, sin «/ 100».", render: (m) => <GaugeJ m={m} /> },
    { id: "K", title: "A con las 4 zonas a color", note: "Se ven las 4 zonas (la tuya encendida), aguja afinada y el nombre de la zona bajo el número.", render: (m) => <GaugeK m={m} /> },
    { id: "L", title: "A sin aguja, con perilla", note: "El arco se llena hasta una perilla, con rayitas de escala; el número y la zona van dentro del arco.", render: (m) => <GaugeL m={m} /> },
    { id: "M", title: "A con escala graduada", note: "Escala 0·25·50·75·100 por fuera y un puntero triangular por dentro, en lugar de aguja.", render: (m) => <GaugeM m={m} /> },
    { id: "N", title: "M limpio, divisores negros", note: "Sin números ni rayas de escala; divisores negros apenas más largos que el ancho del arco.", render: (m) => <GaugeMClean m={m} mode="N" /> },
    { id: "O", title: "M limpio, divisores de espacio", note: "Igual al N, pero las secciones se separan con un espacio, como en el K.", render: (m) => <GaugeMClean m={m} mode="O" /> },
    { id: "P", title: "M limpio, zonas a color", note: "Divisores negros como el N, y cada sección con el color de su zona (llena hasta tu valor).", render: (m) => <GaugeMClean m={m} mode="P" /> },
    { id: "Q", title: "P sin divisores", note: "Las zonas a color, llenas hasta tu valor, sin ninguna raya entre secciones.", render: (m) => <GaugeMClean m={m} mode="Q" /> },
    { id: "R", title: "Propuesta: lo mejor de cada uno", note: "Aguja del A, zonas a color llenas hasta tu valor (P/Q), separadas por espacio (O), un solo número (J) y el significado en los extremos.", render: (m) => <GaugeR m={m} /> },
    { id: "S", title: "N con divisores iguales", note: "Como el N, con los 3 divisores del mismo largo (31) y «de 100» bajo el número.", render: (m) => <GaugeS m={m} /> },
    { id: "D", title: "Medidor refinado (impeccable)", note: "4 zonas separadas, un punto en vez de aguja, el número cuenta hacia arriba y el significado en los extremos.", render: (m) => <GaugeImpeccable m={m} /> },
    { id: "H", title: "Tacómetro con carácter", note: "Escala graduada, banda de zonas, aguja que barre con rebote y visor de tablero.", render: (m) => <GaugeTacho m={m} /> },
    { id: "I", title: "Medidor sobrio de rayas", note: "Monocromo: las rayas se marcan hasta tu valor y solo la tuya lleva color.", render: (m) => <GaugeSober m={m} /> },
];

export default function ChartLab({ m }: { m: ResultModel }) {
    const [run, setRun] = useState(0);
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-base text-muted-foreground">
                    Perfil actual: <strong className="text-foreground">{m.zoneTitle}</strong> · carga {m.load} % · recuperación {m.recovery} %
                </p>
                <button
                    type="button"
                    onClick={() => setRun((r) => r + 1)}
                    className="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg border text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Repetir animación
                </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CHARTS.map((c) => (
                    <section key={`${c.id}-${run}`} className="bg-card border rounded-2xl p-5 flex flex-col gap-4 text-left">
                        <div>
                            <h2 className="text-lg font-bold">
                                {c.id} · {c.title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-snug">{c.note}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center py-2">{c.render(m)}</div>
                    </section>
                ))}
            </div>
        </div>
    );
}
