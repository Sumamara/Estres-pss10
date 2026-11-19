import Link from "next/link";
import { ArrowRight, FlaskConical, PlayCircle, Sparkles } from "lucide-react";

const LABS = [
    {
        href: "/test-ultimo",
        title: "Test Último (Flujo Completo Compacto)",
        badge: "Nuevo · 3 Preguntas",
        description:
            "Pantalla de bienvenida oficial, 3 preguntas de muestra y las pantallas de salida finales (Historias 1 a 5) sin guardar datos en Supabase.",
        icon: PlayCircle,
        accent: "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400",
        badgeClass: "bg-emerald-100 text-emerald-800",
    },
    {
        href: "/prueba-resultados",
        title: "Prueba de Resultados",
        badge: "Laboratorio de Salidas",
        description:
            "Previsualiza los 4 perfiles (Óptimo, Vulnerable, Sobrecarga, Burnout), compara variantes de copy y explora todos los prototipos visuales.",
        icon: FlaskConical,
        accent: "border-blue-200 bg-blue-50/40 hover:border-blue-400",
        badgeClass: "bg-blue-100 text-blue-800",
    },
    {
        href: "/preview-motion",
        title: "Preview Motion",
        badge: "15 Animaciones",
        description:
            "Sandbox interactivo para probar 15 estilos de transición, tiempos de respuesta y micro-interacciones entre preguntas.",
        icon: Sparkles,
        accent: "border-amber-200 bg-amber-50/40 hover:border-amber-400",
        badgeClass: "bg-amber-100 text-amber-800",
    },
];

export default function PruebasHome() {
    return (
        <main className="min-h-screen bg-background px-6 py-16 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl space-y-8">
                <header className="space-y-2 text-center sm:text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Entorno de Experimentación · PAEM-18
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Pruebas de Diseño Web
                    </h1>
                    <p className="text-base text-muted-foreground max-w-2xl">
                        Espacio aislado para probar animaciones, prototipos de resultados y el flujo compacto de principio a fin sin afectar el proyecto de producción.
                    </p>
                </header>

                <div className="grid gap-4">
                    {LABS.map((lab) => {
                        const Icon = lab.icon;
                        return (
                            <Link
                                key={lab.href}
                                href={lab.href}
                                className={`group rounded-2xl border p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${lab.accent}`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <Icon className="w-5 h-5 text-foreground/80" />
                                        <h2 className="text-lg font-bold text-foreground">{lab.title}</h2>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lab.badgeClass}`}>
                                            {lab.badge}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lab.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground shrink-0 group-hover:translate-x-1 transition-transform">
                                    <span>Abrir</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

