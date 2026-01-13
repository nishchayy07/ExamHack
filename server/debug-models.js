import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') })

async function listModels() {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('❌ GOOGLE_AI_API_KEY not found!')
      return
    }

    console.log('🔑 Using API Key:', process.env.GOOGLE_AI_API_KEY.substring(0, 10) + '...')
    
    // Initialize API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    
    // Hack: The SDK doesn't expose listModels directly on the main class in some versions,
    // but we can try to use the model directly or just check if it works.
    
    // Actually, let's just Try a few standard names and see which one doesn't throw 404
    const candidates = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.0-pro-001',
      'gemini-1.5-pro'
    ]
    
    console.log('🔄 Testing model availability...')
    
    for (const modelName of candidates) {
      try {
        process.stdout.write(`Testing ${modelName}... `)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Hello')
        const response = await result.response;
        console.log(`✅ SUCCESS!`)
        console.log(`Response: ${response.text()}`)
        console.log(`\n🎉 USE THIS MODEL: "${modelName}"\n`)
        return // Found one!
      } catch (error) {
        if (error.message.includes('404')) {
           console.log(`❌ Not Found`)
        } else {
           console.log(`❌ Error: ${error.message}`)
        }
      }
    }
    
    console.log('❌ No working models found in standard list.')

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

listModels()
