import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

async function listAvailableModels() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  
  console.log('🔍 Listing available Gemini models...\n')
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    const response = await axios.get(url)
    
    console.log('✅ Available models:\n')
    response.data.models.forEach(model => {
      console.log(`📦 ${model.name}`)
      console.log(`   Display Name: ${model.displayName}`)
      console.log(`   Supported methods: ${model.supportedGenerationMethods?.join(', ')}`)
      console.log('')
    })
    
    console.log('\n💡 Use one of these model names in your API calls!')
    
  } catch (error) {
    console.error('❌ Failed to list models')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

listAvailableModels()
