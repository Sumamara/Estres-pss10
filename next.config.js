/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // La app es 100% cliente (sin API routes ni datos de servidor), así que se
  // exporta como HTML estático a ./out y Netlify solo sirve archivos.
  output: 'export',

  // Ruta base del despliegue. En Netlify se define en netlify.toml.
  basePath: process.env.RUTA_BASE || undefined,

  images: {
    unoptimized: true,
  },

  // Nota: `headers()` no existe en export estático (Next lo ignora y avisa).
  // Las cabeceras se definen ahora en netlify.toml.
}

module.exports = nextConfig
