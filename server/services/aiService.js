import { GoogleGenerativeAI } from '@google/generative-ai'
import { extractAllPDFs } from './pdfService.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export async function analyzePapers(courseCode, pdfPaths) {
  try {
    console.log(`🤖 Starting AI analysis for ${courseCode}...`)

    // Step 1: Extract text from all PDFs
    console.log(`📚 Extracting text from ${pdfPaths.length} PDFs...`)
    const allText = await extractAllPDFs(pdfPaths)

    if (!allText || allText.length < 100) {
      throw new Error('Insufficient text extracted from PDFs')
    }

    console.log(`✅ Extracted ${allText.length} characters total`)

    // Step 2: Initialize Gemini
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY not found in environment variables')
    }

    // Step 3: Analyze with AI (Direct REST API)
    console.log(`🧠 Running AI analysis (Direct Mode)...`)
    
    const promptText = `You are an expert exam analyzer for the course "${courseCode}". Analyze the following exam papers:
    
    1. **Top 10 Most Repeated Questions** (Extract exact text, counts, years, AND categorization)
    2. **Topic Weightage Analysis** (Topic name, count, percentage)
    
    For each question, identify:
    - **topic**: General category (e.g., "Stacks", "Sorting Algorithms", "Normalization")
    - **subtopic**: Specific concept when possible (e.g., "Infix to Postfix", "Quick Sort", "3NF")
    
    IMPORTANT: Always provide a topic. Only add subtopic if the question is about a specific algorithm, technique, or concept.
    
    Examples:
    - Question about "Convert infix to postfix using stack" → topic: "Stacks", subtopic: "Infix to Postfix"
    - Question about "Quick Sort algorithm" → topic: "Sorting Algorithms", subtopic: "Quick Sort"
    - Question about "Explain 1NF, 2NF, 3NF" → topic: "Normalization", subtopic: "Normal Forms"
    - General question about "What is a stack?" → topic: "Stacks", subtopic: null
    
    Return VALID JSON ONLY:
    {
      "topQuestions": [ 
        { 
          "topic": "General Topic",
          "subtopic": "Specific Concept or null",
          "text": "Full question text...", 
          "frequency": 5, 
          "years": ["2024", "2023"] 
        } 
      ],
      "topicWeightage": [ { "name": "...", "count": 10, "percentage": 20 } ]
    }
    
    EXAM PAPERS TEXT:
    ${allText.substring(0, 30000)}` // Limit to safe token count

    let text;
    try {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      // Using gemini-2.5-flash which is available for this API key
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{
          parts: [{ text: promptText }]
        }]
      };

      console.log(`📤 Sending request to Google API...`)
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        text = response.data.candidates[0].content.parts[0].text;
        console.log('✅ API Response Received (Direct)')
      } else {
        throw new Error('No candidates in API response');
      }

    } catch (apiError) {
      console.error('❌ AI API Call Failed:', apiError.message)
      if (apiError.response) {
         console.error('   Status:', apiError.response.status)
         console.error('   Details:', JSON.stringify(apiError.response.data))
      }
      if (apiError.code) {
         console.error('   Error Code:', apiError.code)
      }
      
      // Throw proper error instead of returning mock data
      let errorMessage = 'Google Gemini API call failed. '
      if (apiError.response?.status === 404) {
        errorMessage += 'Model not found. Please check API key configuration.'
      } else if (apiError.response?.status === 429) {
        errorMessage += 'API quota exceeded. Please try again later.'
      } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ETIMEDOUT') {
        errorMessage += 'Cannot connect to Google API. Check your internet connection.'
      } else {
        errorMessage += apiError.message
      }
      
      throw new Error(errorMessage)
    }

    // Parse JSON response
    console.log(`📊 Parsing AI response...`)
    console.log(`   Response length: ${text?.length || 0} characters`)
    console.log(`   First 200 chars: ${text?.substring(0, 200)}`)
    let analysis
    try {
      // Extract JSON from response (in case there's markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = JSON.parse(text)
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response!')
      console.error('   Parse error:', parseError.message)
      console.error('   Full response text:', text)
      
      // Throw proper error instead of returning mock data
      throw new Error(`Failed to parse AI response: ${parseError.message}. The AI returned invalid JSON format.`)
    }

    // Ensure we have exactly 10 questions
    if (analysis.topQuestions && analysis.topQuestions.length > 10) {
      analysis.topQuestions = analysis.topQuestions.slice(0, 10)
    }

    console.log(`✨ Analysis complete!`)
    console.log(`   - Found ${analysis.topQuestions?.length || 0} top questions`)
    console.log(`   - Identified ${analysis.topicWeightage?.length || 0} topics`)

    return analysis

  } catch (error) {
    console.error('AI Analysis error:', error)
    throw new Error(`Failed to analyze papers: ${error.message}`)
  }
}
