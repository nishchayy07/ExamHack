import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import scraperRoutes from './routes/scraper.js'
import analyzeRoutes from './routes/analyze.js'
import downloadRoutes from './routes/download.js'
import { analyzeRateLimiter, scrapeRateLimiter } from './middleware/rateLimiter.js'
import { clearExpiredCache } from './services/cacheService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Middleware - CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes (rate limiters will be applied within route files)
app.use('/api', scraperRoutes)
app.use('/api', analyzeRoutes)
app.use('/api', downloadRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ExamHack API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  })
})

// Clear expired cache on startup
clearExpiredCache()

app.listen(PORT, () => {
  console.log(`🚀 ExamHack server running on http://localhost:${PORT}`)
  console.log(`💾 Cache system enabled`)
  console.log(`🛡️ Rate limiting active: 3 requests/hour`)
})
