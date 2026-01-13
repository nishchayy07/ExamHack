import express from 'express'
import { scrapePapers } from '../services/scraperService.js'
import { scrapeRateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/scrape', scrapeRateLimiter, async (req, res) => {
  try {
    const { courseCode, examType = 'ALL' } = req.body

    if (!courseCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course code is required' 
      })
    }

    console.log(`📚 Scraping ${examType} papers for: ${courseCode}`)
    
    const pdfPaths = await scrapePapers(courseCode, examType)

    console.log(`✅ Scraping completed: ${pdfPaths.length} papers`)

    res.json({ 
      success: true, 
      courseCode,
      examType,
      pdfPaths,
      count: pdfPaths.length,
      message: `Successfully downloaded ${pdfPaths.length} ${examType} papers`
    })

  } catch (error) {
    console.error('❌ Scraping error:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ 
      success: false, 
      message: `Scraping failed: ${error.message}` 
    })
  }
})

export default router
