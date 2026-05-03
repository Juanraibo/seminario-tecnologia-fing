import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/proxy/classify': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          rewrite: (path) => '/api/v1/chat/completions',
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_OPENROUTER_API_KEY}`)
              proxyReq.setHeader('HTTP-Referer', 'http://localhost:5173')
              proxyReq.setHeader('X-Title', 'EcoFIng')
            })
          },
        },
        '/api/proxy/carbon': {
          target: 'https://api.climatiq.io',
          changeOrigin: true,
          rewrite: (path) => '/data/v1/estimate',
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_CLIMATIQ_API_KEY}`)
            })
          },
        },
      },
    },
  }
})
