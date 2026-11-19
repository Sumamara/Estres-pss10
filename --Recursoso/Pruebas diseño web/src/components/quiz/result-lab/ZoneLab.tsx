"use client";

/* ── Laboratorio de la leyenda de zonas ──
   Variantes de cómo mostrar Resiliente · Frágil · Bajo Presión · Riesgo de Burnout
   bajo el medidor. Cada tarjeta simula el ancho de un celular (327 px de contenido). */

import type { ResultModel } from "./model";

type Z = ResultModel["zones"][number];

const Label = ({ z, active, className = "" }: { z: Z; active: boolean; className?: string }) => (
    <span
        className={`block text-[12px] leading-[1.2] [text-wrap:balance] ${active ? "font-semibold text-foreground" : "font-medium text-muted-foreground"} ${className}`}
    >
        {z.title}
    </span>
);

/* 1 · Regla de zonas (versión B): tramos finos, el tuyo más grueso y a color pleno */
export function ZRuler({ m, sameWeight = false }: { m: ResultModel; sameWeight?: boolean }) {
    return (
        <ol className="grid grid-cols-4 gap-1.5" aria-label="Zonas posibles">
            {m.zones.map((z) => {
                const a = z.key === m.zoneKey;
                return (
                    <li key={z.key} aria-current={a ? "true" : undefined} className="flex flex-col items-center gap-1.5 text-center">
                        <span className="flex h-2 w-full items-end">
                            <span className="w-full rounded-full" style={{ height: a && !sameWeight ? 8 : 4, backgroundColor: z.hex, opacity: a ? 1 : 0.28 }} />
                        </span>
                        <Label z={z} active={a} />
                    </li>
                );
            })}
        </ol>
    );
}

/* 2 · Imagen 1: punto arriba, nombre abajo, la tuya en píldora con su color */
function ZPillColor({ m, neutral = false }: { m: ResultModel; neutral?: boolean }) {
    return (
        <ol className="grid grid-cols-4 gap-1" aria-label="Zonas posibles">
            {m.zones.map((z) => {
                const a = z.key === m.zoneKey;
                const style = a
                    ? neutral
                        ? { backgroundColor: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }
                        : { backgroundColor: `${z.hex}14`, borderColor: `${z.hex}66` }
                    : { borderColor: "transparent" };
                return (
                    <li
                        key={z.key}
                        aria-current={a ? "true" : undefined}
                        className="flex flex-col items-center gap-1 rounded-xl border px-1 py-1.5 text-center"
                        style={style}
                    >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: z.hex, opacity: a || !neutral ? 1 : 0.55 }} aria-hidden="true" />
                        <Label z={z} active={a} />
                    </li>
                );
            })}
        </ol>
    );
}

/* 4 · Imagen 2 sin rangos: barra arriba de cada celda; la tuya en tarjeta con su barra a color */
export function ZTabs({ m, plain = false }: { m: ResultModel; plain?: boolean }) {
    return (
        <ol className="grid grid-cols-4 gap-1.5" aria-label="Zonas posibles">
            {m.zones.map((z) => {
                const a = z.key === m.zoneKey;
                return (
                    <li
                        key={z.key}
                        aria-current={a ? "true" : undefined}
                        className={`overflow-hidden rounded-lg text-center ${a && !plain ? "border border-border bg-muted/70" : ""}`}
                    >
                        <span className="block h-1" style={{ backgroundColor: a ? z.hex : "hsl(var(--border))" }} />
                        <span className="block px-1 py-2">
                            <Label z={z} active={a} />
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

/* 5 · Imagen 3 con los nombres actuales: punto suave arriba, la tuya en caja gris azulada */
function ZSoftBox({ m }: { m: ResultModel }) {
    return (
        <ol className="flex justify-between gap-1" aria-label="Zonas posibles">
            {m.zones.map((z) => {
                const a = z.key === m.zoneKey;
                return (
                    <li
                        key={z.key}
                        aria-current={a ? "true" : undefined}
                        className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-1 py-2 text-center"
                        style={a ? { backgroundColor: "#eef2f8", borderColor: "#cdd8ea" } : { borderColor: "transparent" }}
                    >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: z.hex, opacity: a ? 1 : 0.5 }} aria-hidden="true" />
                        <Label z={z} active={a} />
                    </li>
                );
            })}
        </ol>
    );
}

/* 6 · Imagen 4: barra por tramos con marcador en tu valor y los nombres debajo */
export function ZMarkerBar({ m, bare = false }: { m: ResultModel; bare?: boolean }) {
    return (
        <div className="space-y-1.5">
            <div className={`relative ${bare ? "" : "pt-6"}`}>
                {!bare && <span
                    className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-sm font-bold tabular-nums"
                    style={{ left: `clamp(2.25rem, ${m.score}%, calc(100% - 2.25rem))`, color: m.zoneInk }}
                >
                    {m.score} de 100
                </span>}
                <div className="flex h-2.5 gap-1" aria-hidden="true">
                    {m.zones.map((z) => (
                        <span
                            key={z.key}
                            className="flex-1 first:rounded-l-full last:rounded-r-full"
                            style={{ backgroundColor: z.hex, opacity: z.key === m.zoneKey ? 1 : 0.25 }}
                        />
                    ))}
                </div>
                {!bare && (
                    <span
                        className="absolute top-[1.3rem] h-5 w-1.5 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card"
                        style={{ left: `${m.score}%` }}
                        aria-hidden="true"
                    />
                )}
            </div>
            <ol className="grid grid-cols-4 gap-1 text-center" aria-label="Zonas posibles">
                {m.zones.map((z) => (
                    <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined}>
                        <Label z={z} active={z.key === m.zoneKey} />
                    </li>
                ))}
            </ol>
        </div>
    );
}

/* 7 · Imagen 5: barra continua a color con perilla en tu valor y nombres debajo */
function ZKnobBar({ m }: { m: ResultModel }) {
    return (
        <div className="space-y-2">
            <div className="relative py-1.5" aria-hidden="true">
                <div className="flex h-2 overflow-hidden rounded-full">
                    {m.zones.map((z) => (
                        <span key={z.key} className="flex-1" style={{ backgroundColor: z.ink }} />
                    ))}
                </div>
                <span
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_1px_4px_rgba(15,23,42,0.35)]"
                    style={{ left: `${m.score}%`, backgroundColor: m.zoneInk }}
                />
            </div>
            <ol className="grid grid-cols-4 gap-1 text-center" aria-label="Zonas posibles">
                {m.zones.map((z) => (
                    <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined}>
                        <Label z={z} active={z.key === m.zoneKey} />
                    </li>
                ))}
            </ol>
        </div>
    );
}

/* 8 · Idea propia: escalera (barras que suben como el desgaste) */
function ZSteps({ m }: { m: ResultModel }) {
    const heights = [8, 13, 18, 23];
    return (
        <ol className="grid grid-cols-4 gap-1.5 items-end" aria-label="Zonas posibles">
            {m.zones.map((z, i) => {
                const a = z.key === m.zoneKey;
                return (
                    <li key={z.key} aria-current={a ? "true" : undefined} className="flex flex-col items-center gap-1.5 text-center">
                        <span
                            className="w-full rounded-[4px]"
                            style={{ height: heights[i], backgroundColor: a ? z.hex : "hsl(var(--foreground) / 0.1)" }}
                            aria-hidden="true"
                        />
                        <Label z={z} active={a} />
                    </li>
                );
            })}
        </ol>
    );
}

/* 9 · Idea propia: recorrido en una línea con flechas; la tuya subrayada en su color */
function ZPath({ m }: { m: ResultModel }) {
    return (
        <ol className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center" aria-label="Zonas posibles">
            {m.zones.map((z, i) => {
                const a = z.key === m.zoneKey;
                return (
                    <li key={z.key} aria-current={a ? "true" : undefined} className="flex items-center gap-1.5">
                        <span
                            className={`text-[13px] ${a ? "font-semibold text-foreground underline decoration-2 underline-offset-[5px]" : "text-muted-foreground"}`}
                            style={a ? { textDecorationColor: z.hex } : undefined}
                        >
                            {z.title}
                        </span>
                        {i < m.zones.length - 1 && (
                            <span className="text-muted-foreground/60" aria-hidden="true">
                                ›
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

/* 10 · impeccable: escala tipográfica sobre una línea fina; solo tu tramo lleva color */
export function ZHairline({ m }: { m: ResultModel }) {
    const idx = m.zones.findIndex((z) => z.key === m.zoneKey);
    return (
        <div className="space-y-2">
            <div className="relative h-3" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/15" />
                {[25, 50, 75].map((t) => (
                    <span key={t} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-foreground/25" style={{ left: `${t}%` }} />
                ))}
                <span
                    className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
                    style={{ left: `calc(${idx * 25}% + 3px)`, width: "calc(25% - 6px)", backgroundColor: m.zoneHex }}
                />
            </div>
            <ol className="grid grid-cols-4 text-center" aria-label="Zonas posibles">
                {m.zones.map((z) => (
                    <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined}>
                        <span
                            className={`block text-[12px] leading-[1.2] [text-wrap:balance] ${z.key === m.zoneKey ? "font-semibold" : "font-medium text-muted-foreground"}`}
                            style={z.key === m.zoneKey ? { color: z.ink } : undefined}
                        >
                            {z.title}
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

/* 11 · design-taste-frontend: control segmentado plano, celdas iguales, la tuya invertida en tinta */
export function ZSegmented({ m }: { m: ResultModel }) {
    return (
        <ol className="grid grid-cols-4 overflow-hidden rounded-[10px] border border-foreground/15" aria-label="Zonas posibles">
            {m.zones.map((z, i) => {
                const a = z.key === m.zoneKey;
                return (
                    <li
                        key={z.key}
                        aria-current={a ? "true" : undefined}
                        className={`flex min-h-[40px] items-center justify-center px-1 py-1.5 text-center ${i > 0 ? "border-l border-foreground/15" : ""} ${a ? "bg-foreground text-background" : ""}`}
                    >
                        <span className={`block text-[12px] leading-[1.2] [text-wrap:balance] ${a ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                            {z.title}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

/* 12 · design-taste-frontend: el dato llano, "Zona 4 de 4", con cuatro marcas */
function ZPlainFact({ m }: { m: ResultModel }) {
    const idx = m.zones.findIndex((z) => z.key === m.zoneKey);
    return (
        <div className="flex items-center justify-between gap-3 border-y border-foreground/15 py-2.5">
            <p className="text-sm">
                <span className="font-semibold">Zona {idx + 1} de 4</span>
                <span className="text-muted-foreground"> · de Resiliente a Riesgo de Burnout</span>
            </p>
            <span className="flex gap-1" aria-hidden="true">
                {m.zones.map((z, i) => (
                    <span key={z.key} className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: i <= idx ? m.zoneHex : "hsl(var(--foreground) / 0.12)" }} />
                ))}
            </span>
        </div>
    );
}

/* 3 (actual) · la leyenda que tiene hoy «En preparación», como referencia */
function ZCurrent({ m }: { m: ResultModel }) {
    return (
        <ol className="flex flex-wrap justify-center min-[340px]:justify-between gap-x-1 gap-y-1" aria-label="Zonas posibles">
            {m.zones.map((z) => {
                const a = z.key === m.zoneKey;
                return (
                    <li key={z.key} aria-current={a ? "true" : undefined} className="flex items-center gap-1 whitespace-nowrap">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: z.hex, opacity: a ? 1 : 0.35 }} aria-hidden="true" />
                        <span className={`text-[12px] ${a ? "font-semibold text-foreground" : "font-medium text-muted-foreground/80"}`}>{z.title}</span>
                    </li>
                );
            })}
        </ol>
    );
}

const VARIANTS: { id: string; title: string; note: string; render: (m: ResultModel) => JSX.Element }[] = [
    { id: "0", title: "Actual (referencia)", note: "Lo que tiene hoy «En preparación»: punto + nombre en una línea.", render: (m) => <ZCurrent m={m} /> },
    { id: "1", title: "Regla de zonas (versión B)", note: "Tramos finos de color; el tuyo más grueso y pleno, los demás tenues; nombres debajo.", render: (m) => <ZRuler m={m} /> },
    { id: "2", title: "Imagen 1", note: "Punto arriba, nombre abajo; la tuya en una píldora con el color de su zona.", render: (m) => <ZPillColor m={m} /> },
    { id: "3", title: "Imagen 1 en gris", note: "Igual que la 2, pero la píldora es gris neutra; solo los puntos llevan color.", render: (m) => <ZPillColor m={m} neutral /> },
    { id: "4", title: "Imagen 2 sin rangos", note: "Barra arriba de cada celda; la tuya en tarjeta con su barra a color.", render: (m) => <ZTabs m={m} /> },
    { id: "5", title: "Imagen 3 con nombres actuales", note: "Punto suave arriba; la tuya en una caja gris azulada, sobria.", render: (m) => <ZSoftBox m={m} /> },
    { id: "6", title: "Imagen 4: barra con nombres", note: "Barra por tramos con marcador y tu valor encima; los nombres debajo.", render: (m) => <ZMarkerBar m={m} /> },
    { id: "7", title: "Imagen 5: barra con perilla", note: "Barra continua a color con una perilla en tu valor; nombres debajo.", render: (m) => <ZKnobBar m={m} /> },
    { id: "8", title: "Idea · Escalera", note: "Barras que suben como el desgaste; la tuya a color, las demás grises.", render: (m) => <ZSteps m={m} /> },
    { id: "9", title: "Idea · Recorrido", note: "Una línea de izquierda a derecha con flechas; la tuya subrayada en su color.", render: (m) => <ZPath m={m} /> },
    { id: "10", title: "impeccable · Escala fina", note: "Una línea fina con marcas en 25/50/75; solo tu tramo lleva color y tu nombre va en su tinta.", render: (m) => <ZHairline m={m} /> },
    { id: "11", title: "taste · Control segmentado", note: "Celdas iguales con líneas finas, plano; la tuya invertida en tinta oscura.", render: (m) => <ZSegmented m={m} /> },
    { id: "12", title: "taste · El dato llano", note: "«Zona 4 de 4 · de Resiliente a Riesgo de Burnout» con cuatro marcas.", render: (m) => <ZPlainFact m={m} /> },
];

export default function ZoneLab({ m }: { m: ResultModel }) {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-5">
            <p className="text-base text-muted-foreground">
                Perfil actual: <strong className="text-foreground">{m.zoneTitle}</strong> · {m.score} de 100. Cada tarjeta tiene el ancho del contenido en un celular (327 px).
            </p>
            <div className="grid gap-4 md:grid-cols-2">
                {VARIANTS.map((v) => (
                    <section key={v.id} className="bg-card border rounded-2xl p-5 flex flex-col gap-4 text-left">
                        <div>
                            <h2 className="text-lg font-bold">
                                {v.id} · {v.title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-snug">{v.note}</p>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="w-full max-w-[327px] mx-auto">{v.render(m)}</div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
