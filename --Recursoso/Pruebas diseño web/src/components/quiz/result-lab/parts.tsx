"use client";

import { useEffect, useState } from "react";

/* Las piezas que comparte con el resultado principal */
export { TiltBalanceSolid, WhatsAppIcon, useRetake } from "../result/parts";

/* ── Balanza del resultado ──
   La misma marca de la bienvenida, pero ahora se inclina con tus datos:
   baja el platillo que pesa más (carga a la izquierda, recuperación a la derecha). */
export const TiltBalance = ({
    load,
    recovery,
    className,
    ink = "currentColor",
    loadColor = "#e11d48",
    recoveryColor = "#059669",
}: {
    load: number;
    recovery: number;
    className?: string;
    ink?: string;
    loadColor?: string;
    recoveryColor?: string;
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

    // Extremos del brazo (pivote en 60,18; medio brazo de 44)
    const rad = (tilt * Math.PI) / 180;
    const dxL = 44 - 44 * Math.cos(rad);
    const dyL = 44 * Math.sin(rad);
    const ease = "transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)";

    return (
        <svg viewBox="0 0 120 70" className={className} role="img" aria-label={`Balanza: carga ${load} %, recuperación ${recovery} %`}>
            <line x1="46" y1="64" x2="74" y2="64" stroke={ink} strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="18" x2="60" y2="64" stroke={ink} strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
            <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: "60px 18px", transition: ease }}>
                <line x1="16" y1="18" x2="104" y2="18" stroke={ink} strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Platillo de carga: baja cuando la carga pesa más */}
            <g style={{ transform: `translate(${dxL}px, ${dyL}px)`, transition: ease }}>
                <line x1="16" y1="18" x2="7" y2="38" stroke={loadColor} strokeWidth="1.5" />
                <line x1="16" y1="18" x2="25" y2="38" stroke={loadColor} strokeWidth="1.5" />
                <path d="M4 38 H28 Q16 50 4 38 Z" fill={loadColor} fillOpacity="0.18" stroke={loadColor} strokeWidth="2" strokeLinejoin="round" />
            </g>
            {/* Platillo de recuperación */}
            <g style={{ transform: `translate(${-dxL}px, ${-dyL}px)`, transition: ease }}>
                <line x1="104" y1="18" x2="95" y2="38" stroke={recoveryColor} strokeWidth="1.5" />
                <line x1="104" y1="18" x2="113" y2="38" stroke={recoveryColor} strokeWidth="1.5" />
                <path d="M92 38 H116 Q104 50 92 38 Z" fill={recoveryColor} fillOpacity="0.18" stroke={recoveryColor} strokeWidth="2" strokeLinejoin="round" />
            </g>
            <circle cx="60" cy="18" r="4" fill="#fff" stroke={ink} strokeWidth="2.5" />
        </svg>
    );
};
