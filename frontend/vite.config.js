import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const googleClientId = String(
    env.VITE_GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID || ''
  ).trim()

  const apiOrigin = String(env.VITE_API_URL || 'http://localhost:5000')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api\/v1\/?$/i, '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId),
    },
    server: {
      host: true,
      port: 5173,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      proxy: {
        // Same-origin API in dev → avoids CORS / localhost vs 127.0.0.1 issues
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
