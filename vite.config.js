import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleAiChatRequest } from './lib/aiProvider.js'

/** Dev-only middleware — mirrors api/chat.js so EcoAI & SnapSort work with `npm run dev` */
function devChatApiPlugin(env) {
  return {
    name: 'dev-chat-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/chat')) return next()

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const body = await readBody(req)
          const parsed = JSON.parse(body)
          const message = await handleAiChatRequest(parsed, env)

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(message))
        } catch (error) {
          console.error('[dev-chat-api] AI error:', error)
          const message = error?.message || 'Error processing request'
          const status = error?.status === 429 || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')
            ? 429
            : 500
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devChatApiPlugin(env)],
  }
})
