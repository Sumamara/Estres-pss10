# 🧠 Test de Estrés Percibido — PSS-10

Aplicación interactiva basada en la **Escala de Estrés Percibido (PSS-10)** de Cohen (1983). En 10 preguntas y 2 minutos, el usuario obtiene su nivel de estrés percibido, una explicación clara de lo que significa y una habilidad práctica que puede aplicar de inmediato.

## 🎯 Las 3 bandas de resultado

| Banda | Rango | Qué significa |
|---|---|---|
| 🟢 **Estrés bajo** | 0 – 13 | Estrés controlado. Buen momento para construir habilidades preventivas. |
| 🟡 **Estrés moderado** | 14 – 26 | Funcionas, pero con el motor revolucionado. La zona que se normaliza. |
| 🔴 **Estrés alto/severo** | 27 – 40 | Estrés alto. Toca bajar la activación antes de organizarse. |

Cada banda incluye una **habilidad específica** respaldada por investigación científica.

## 🌟 Características

- **10 preguntas PSS-10** con ítems invertidos (4, 5, 7, 8) calculados automáticamente.
- **Medidor semicircular animado** — SVG con aguja animada, divisores por rango (`0–13`, `14–26`, `27–40`) y regla inferior de las 3 zonas.
- **Contador animado** — el score cuenta de 0 a N con ease-out quart.
- **Secciones colapsables** — "¿Qué significa?" y la habilidad se expanden al tocar.
- **Flechas de flujo** — chevrons animados que guían la mirada paso a paso.
- **CTA de WhatsApp** — enlace directo con mensaje pre-escrito para contactar.
- **Guardado automático** — cada resultado se inserta en Supabase (tabla `Estres_PSS10`) sin bloquear la UI.
- **Diseño premium** — gradientes por banda, glows radiales, tipografía Outfit/Inter, animaciones escalonadas.

## 🛠️ Tecnologías

- **Frontend**: React 18, Next.js 14, TypeScript
- **Estilos**: Tailwind CSS 3, Shadcn UI, Lucide React
- **Backend**: Supabase (PostgreSQL) — opcional, la app funciona sin él
- **Deploy**: Netlify (configurado en `netlify.toml`)

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Opcional | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Opcional | Clave anónima de Supabase |
| `NEXT_PUBLIC_SITE_URL` | Opcional | URL pública del sitio (para Open Graph) |
| `RUTA_BASE` | Opcional | Ruta base para subdirectorios en Netlify |

> **Nota:** Sin las variables de Supabase la app funciona igual — simplemente no guarda las respuestas.

## 📊 Base de datos

Configura la tabla `Estres_PSS10` en Supabase (puedes tomar como base el esquema de `setup_pss10_table.sql`) con las columnas necesarias y una política RLS de `INSERT` para `anon`.

## 📁 Estructura principal

```
src/
├── app/
│   ├── layout.tsx          # Metadata + Providers
│   └── page.tsx            # Punto de entrada
├── components/
│   ├── quiz/
│   │   ├── QuizEngine.tsx  # Estado global del flujo
│   │   ├── QuizWelcome.tsx # Pantalla de bienvenida + nombre
│   │   ├── QuizQuestion.tsx# Pregunta individual + animación
│   │   ├── QuizResult.tsx  # Pantalla de resultados completa
│   │   └── quizData.ts     # Preguntas, bandas y scoring
│   └── ui/                 # Componentes Shadcn
└── lib/
    ├── supabaseClient.ts   # Cliente Supabase (null-safe)
    ├── saveQuizResult.ts   # Insert a Estres_PSS10
    └── utils.ts            # cn() helper
```
