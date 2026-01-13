import axios from 'axios'

async function findWorkingModel() {
  const apiKey = 'AIzaSyAmASIskX3-TMlMGO3nLGB8-J1xxowNl20'
  
  console.log('🔍 Finding working Gemini model...\n')
  
  // Get list of models
  const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
  const listResponse = await axios.get(listUrl)
  
  console.log('📦 Available models:')
  const models = listResponse.data.models.filter(m => 
    m.name.includes('gemini') && 
    m.supportedGenerationMethods?.includes('generateContent')
  )
  
  models.forEach(m => {
    console.log(`   - ${m.name}`)
  })
  
  // Test the first one
  if (models.length > 0) {
    const modelName = models[0].name
    console.log(`\n🧪 Testing: ${modelName}`)
    
    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`
    const payload = {
      contents: [{
        parts: [{ text: 'Say "Hello from ExamHack!"' }]
      }]
    }
    
    try {
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      console.log(`\n✅ SUCCESS!`)
      console.log(`   AI Response: "${text}"`)
      console.log(`\n🎯 USE THIS MODEL: ${modelName}`)
      return modelName
    } catch (error) {
      console.error(`❌ Failed:`, error.message)
    }
  }
}

findWorkingModel()
