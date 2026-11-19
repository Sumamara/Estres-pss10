import { Providers } from "@/components/Providers";
import "../index.css";

const basePath = process.env.RUTA_BASE || '';

/* Origen público del sitio. Sin esto, Next resuelve las imágenes de Open Graph
   contra http://localhost:3000 y los previews de WhatsApp/redes salen rotos. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inner-base.com';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: "Test de Estrés Percibido · PSS-10",
    description: "Descubre tu nivel de estrés en 2 minutos con la Escala de Estrés Percibido (PSS-10) de Cohen. Resultado inmediato y una habilidad práctica que puedes usar hoy.",
    icons: {
        icon: [
            { url: `${basePath}/favicon.ico` },
            { url: `${basePath}/favicon.png`, type: 'image/png' }
        ],
        shortcut: `${basePath}/favicon.png`,
        apple: `${basePath}/favicon.png`,
    },
    openGraph: {
        title: "Test de Estrés Percibido · PSS-10",
        description: "10 preguntas, 2 minutos. Mide tu estrés percibido y recibe una habilidad concreta para manejarlo.",
        images: [
            {
                url: `${basePath}/og_image_1771229641740.png`,
                width: 1200,
                height: 630,
                alt: 'Test de Estrés PSS-10 Preview',
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
        <html lang="es">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
