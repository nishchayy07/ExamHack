import fs from 'fs/promises'
import pdfParse from 'pdf-parse'
import Tesseract from 'tesseract.js'

export async function extractTextFromPDF(pdfPath) {
  try {
    console.log(`📄 Processing: ${pdfPath}`)
    
    // Read PDF file
    const dataBuffer = await fs.readFile(pdfPath)
    
    // Try text extraction first
    const pdfData = await pdfParse(dataBuffer)
    let text = pdfData.text

    // If text is too short, likely a scanned PDF - use OCR
    if (text.length < 100) {
      console.log(`🔍 Low text content detected, using OCR...`)
      text = await performOCR(pdfPath)
    }

    // Clean and normalize text
    text = cleanText(text)
    
    console.log(`✅ Extracted ${text.length} characters`)
    return text

  } catch (error) {
    console.error(`Error processing PDF ${pdfPath}:`, error)
    throw error
  }
}

async function performOCR(pdfPath) {
  try {
    const { data: { text } } = await Tesseract.recognize(pdfPath, 'eng', {
      logger: m => console.log(`OCR Progress: ${m.status}`)
    })
    return text
  } catch (error) {
    console.error('OCR error:', error)
    return ''
  }
}

function cleanText(text) {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ')
  
  // Remove special characters but keep question marks, periods, etc.
  text = text.replace(/[^\w\s.?!,;:()\-]/g, '')
  
  // Normalize line breaks
  text = text.replace(/\n+/g, '\n')
  
  return text.trim()
}

export async function extractAllPDFs(pdfPaths) {
  const allText = []
  
  for (const pdfPath of pdfPaths) {
    try {
      const text = await extractTextFromPDF(pdfPath)
      allText.push(text)
    } catch (error) {
      console.error(`Failed to extract text from ${pdfPath}:`, error)
    }
  }
  
  return allText.join('\n\n--- NEW PAPER ---\n\n')
}
