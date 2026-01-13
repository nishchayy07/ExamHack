import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function scrapePapers(courseCode, examType = 'ALL') {
  const downloadDir = path.join(__dirname, '../temp/downloads', courseCode)
  
  // Create download directory
  await fs.mkdir(downloadDir, { recursive: true })

  console.log(`🌐 Launching browser...`)
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    // Set download behavior
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadDir
    })

    console.log(`📖 Navigating to library...`)
    await page.goto('https://cl.thapar.edu/ques.php', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for the course code input to be visible
    await page.waitForSelector('#code')

    // Enter course code
    console.log(`🔍 Searching for: ${courseCode}`)
    await page.type('#code', courseCode)
    
    // Click submit button - use a simpler approach
    console.log(`🖱️  Clicking submit button...`)
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[type="submit"]')
      if (buttons.length > 0) {
        buttons[0].click()
      }
    })
    
    // Wait for results to load
    console.log(`⏳ Waiting for results...`)
    await page.waitForSelector('table', { timeout: 15000 })

    // Extract download links (filter based on exam type)
    console.log(`📥 Extracting ${examType} download links...`)
    const downloadLinks = await page.evaluate((filterType) => {
      const rows = Array.from(document.querySelectorAll('table tr'))
      const links = []
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td')
        if (cells.length >= 6) {
          const examType = cells[4]?.textContent?.trim()
          const downloadLink = cells[5]?.querySelector('a')?.href
          
          if (downloadLink) {
            // Filter based on exam type
            if (filterType === 'ALL') {
              links.push(downloadLink)
            } else if (filterType === 'EST' && examType === 'EST') {
              links.push(downloadLink)
            } else if (filterType === 'MST' && examType === 'MST') {
              links.push(downloadLink)
            } else if (filterType === 'AUX' && examType === 'AUX') {
              links.push(downloadLink)
            } else if (filterType === 'SUMMER_MST' && examType === 'Summer(MST)') {
              links.push(downloadLink)
            } else if (filterType === 'SUMMER_EST' && examType === 'Summer(EST)') {
              links.push(downloadLink)
            }
          }
        }
      })
      
      return links
    }, examType)

    console.log(`✅ Found ${downloadLinks.length} ${examType} papers`)
    
    // Log the first few links for debugging
    if (downloadLinks.length > 0) {
      console.log(`📋 Sample links:`)
      downloadLinks.slice(0, 3).forEach((link, i) => {
        console.log(`   ${i + 1}. ${link}`)
      })
    }

    if (downloadLinks.length === 0) {
      throw new Error(`No ${examType} papers found for ${courseCode}`)
    }

    // Get cookies and user agent from the page to simulate the exact same session
    const cookies = await page.cookies()
    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ')
    const userAgent = await page.browser().userAgent()
    
    // Download each PDF using axios with the session cookies
    const pdfPaths = []
    
    // We can close the browser now as we have the cookies
    await browser.close()
    
    for (let i = 0; i < downloadLinks.length; i++) {
      const link = downloadLinks[i]
      console.log(`⬇️  Downloading paper ${i + 1}/${downloadLinks.length}...`)
      console.log(`   URL: ${link}`)
      
      try {
        // Use axios to download the PDF with proper headers and ignore SSL errors
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        
        const response = await axios.get(link, {
          responseType: 'arraybuffer',
          timeout: 60000,
          headers: {
            'User-Agent': userAgent,
            'Cookie': cookieString,
            'Referer': 'https://cl.thapar.edu/ques.php', 
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Upgrade-Insecure-Requests': '1'
          },
          maxRedirects: 5,
          httpsAgent: httpsAgent
        })
        
        console.log(`   Response status: ${response.status}`)
        console.log(`   Content-Type: ${response.headers['content-type']}`)
        console.log(`   Buffer size: ${response.data.length} bytes`)
        
        // Check if we actually got a PDF or an error HTML page
        const contentType = response.headers['content-type']
        if (response.status === 200 && response.data.length > 0) {
          
          if (contentType && !contentType.includes('pdf') && !contentType.includes('application/octet-stream')) {
             console.warn(`⚠️ Warning: Content-Type is ${contentType}, might not be a PDF`)
          }

          const fileName = `paper_${i + 1}.pdf`
          const pdfPath = path.join(downloadDir, fileName)
          
          await fs.writeFile(pdfPath, response.data)
          pdfPaths.push(pdfPath)
          console.log(`✅ Downloaded: ${fileName}`)
        } else {
          console.error(`❌ Failed to download paper ${i + 1}: Invalid response`)
        }
      } catch (err) {
        console.error(`❌ Failed to download paper ${i + 1}:`, err.message)
        if (err.response) {
          console.error(`   Status: ${err.response.status}`)
        }
      }
    }

    console.log(`✨ Successfully downloaded ${pdfPaths.length} papers`)
    
    if (pdfPaths.length === 0) {
      throw new Error(`Downloaded 0 papers - all downloads failed. The library website might be blocking automated downloads.`)
    }
    
    return pdfPaths

  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error(`Failed to scrape papers: ${error.message}`)
  } finally {
    // Make sure browser is closed
    try {
      await browser.close()
    } catch (e) {
      // Browser already closed
    }
  }
}
