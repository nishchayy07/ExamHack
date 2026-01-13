import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root (same as index.js does)
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('=== Environment Check ===')
console.log('Current directory:', __dirname)
console.log('.env path:', path.join(__dirname, '../.env'))
console.log('')

if (process.env.GOOGLE_AI_API_KEY) {
  console.log('✅ GOOGLE_AI_API_KEY is loaded!')
  console.log('   First 20 chars:', process.env.GOOGLE_AI_API_KEY.substring(0, 20) + '...')
  console.log('   Length:', process.env.GOOGLE_AI_API_KEY.length, 'characters')
} else {
  console.log('❌ GOOGLE_AI_API_KEY is NOT loaded!')
  console.log('   Please check:')
  console.log('   1. .env file exists at:', path.join(__dirname, '../.env'))
  console.log('   2. File contains: GOOGLE_AI_API_KEY=your_key_here')
  console.log('   3. No extra spaces or quotes around the key')
}

console.log('\nAll environment variables:')
console.log(Object.keys(process.env).filter(key => key.includes('GOOGLE')))
