"use client";

/* Piezas del resultado principal: el ícono de WhatsApp, la balanza que se inclina con tus datos
   y la confirmación antes de volver a hacer el test */

import { useEffect, useState } from "react";

export const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
);

/* ── Balanza estilizada (la de la bienvenida), inclinada según tus datos ──
   Silueta sólida: remate, eje, brazo grueso, columna que se ensancha y base en domo.
   Los platillos cuelgan siempre verticales del extremo del brazo. */
export const TiltBalanceSolid = ({
    load,
    recovery,
    className,
}: {
    load: number;
    recovery: number;
    className?: string;
}) => {
    const target = Math.max(-16, Math.min(16, ((load - recovery) / 100) * 22));
    const [tilt, setTilt] = useState(0);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            setTilt(target);
            return;
        }
        setTilt(0);
        const t = setTimeout(() => setTilt(target), 350);
        return () => clearTimeout(t);
    }, [target]);

    const P = { x: 60, y: 16 }, L = 45;
    const rad = (tilt * Math.PI) / 180;
    const left = { x: P.x - L * Math.cos(rad), y: P.y + L * Math.sin(rad) };
    const right = { x: P.x + L * Math.cos(rad), y: P.y - L * Math.sin(rad) };
    const ease = "transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)";

    const pan = (color: string) => (
        <>
            <line x1="0" y1="1" x2="-9.5" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="1" x2="9.5" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M-13 24 H13 Q12 36 0 36 Q-12 36 -13 24 Z" fill={color} />
        </>
    );

    return (
        <svg viewBox="-2 0 124 72" className={className} role="img" aria-label={`Balanza: carga ${load} %, recuperación ${recovery} %`}>
            <rect x="57.5" y="2" width="5" height="12" rx="2.5" className="fill-foreground" />
            <path d="M57.6 18 H62.4 L63.6 62 H56.4 Z" className="fill-foreground" />
            <path d="M41 68 Q41 59 60 59 Q79 59 79 68 Z" className="fill-foreground" />
            <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${P.x}px ${P.y}px`, transition: ease }}>
                <rect x={P.x - L - 4} y={P.y - 2.5} width={(L + 4) * 2} height="5" rx="2.5" className="fill-foreground" />
            </g>
            <g style={{ transform: `translate(${left.x}px, ${left.y}px)`, transition: ease }}>{pan("#f43f5e")}</g>
            <g style={{ transform: `translate(${right.x}px, ${right.y}px)`, transition: ease }}>{pan("#10b981")}</g>
            <circle cx={P.x} cy={P.y} r="6" className="fill-foreground" />
        </svg>
    );
};

/* Reinicio con confirmación  */
export const useRetake = (onRetake: () => void) => () => {
    if (window.confirm("¿Querés hacer el test de nuevo? Vas a perder este resultado.")) onRetake();
};
