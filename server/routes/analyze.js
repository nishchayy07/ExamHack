import express from 'express'
import { analyzePapers } from '../services/aiService.js'
import { getCachedAnalysis, setCachedAnalysis } from '../services/cacheService.js'
import { analyzeRateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/analyze', analyzeRateLimiter, async (req, res) => {
  try {
    const { courseCode, pdfPaths } = req.body

    if (!courseCode || !pdfPaths || pdfPaths.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course code and PDF paths are required' 
      })
    }

    // Check cache first
    const cachedResult = getCachedAnalysis(courseCode)
    if (cachedResult) {
      return res.json({
        success: true,
        courseCode,
        fromCache: true,
        ...cachedResult
      })
    }

    console.log(`🤖 Analyzing ${pdfPaths.length} papers with AI...`)
    
    const analysis = await analyzePapers(courseCode, pdfPaths)

    // Store in cache for future requests
    setCachedAnalysis(courseCode, analysis)

    res.json({ 
      success: true, 
      courseCode,
      fromCache: false,
      ...analysis
    })

  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
})

export default router
