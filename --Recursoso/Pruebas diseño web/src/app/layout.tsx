import { Providers } from "@/components/Providers";
import "../index.css";

const basePath = process.env.RUTA_BASE || '';

/* Origen público del sitio. Sin esto, Next resuelve las imágenes de Open Graph
   contra http://localhost:3000 y los previews de WhatsApp/redes salen rotos. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inner-base.com';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: "Perfil de Autoconciencia del Estrés y Regulación · PAEM-18",
    description: "Descubrí cómo responde tu sistema ante el estrés en 2 minutos con el Protocolo PAEM-18. Evaluá el balance entre tu Carga de Desgaste (mente, emoción, cuerpo y hábitos) y tus Recursos de Regulación.",
    icons: {
        icon: [
            { url: `${basePath}/favicon.ico` },
            { url: `${basePath}/favicon.png`, type: 'image/png' }
        ],
        shortcut: `${basePath}/favicon.png`,
        apple: `${basePath}/favicon.png`,
    },
    openGraph: {
        title: "Mapa de Autoconocimiento del Estrés y Regulación · PAEM-18",
        description: "18 preguntas, 2 minutos. Evaluá tus 4 canales de desgaste frente a tus 2 recursos de autorregulación y recibí una ruta práctica personalizada.",
        images: [
            {
                url: `${basePath}/og_image_1771229641740.png`,
                width: 1200,
                height: 630,
                alt: 'Perfil de Autoconciencia del Estrés PAEM-18 Preview',
            }
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
