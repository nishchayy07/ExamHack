import axios from 'axios'

async function listAndTestModels() {
  const apiKey = 'AIzaSyAmASIskX3-TMlMGO3nLGB8-J1xxowNl20'
  
  console.log('🔍 Listing all available models...\n')
  
  const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
  const listResponse = await axios.get(listUrl)
  
  const geminiModels = listResponse.data.models.filter(m => 
    m.name.toLowerCase().includes('gemini') && 
    m.supportedGenerationMethods?.includes('generateContent')
  )
  
  console.log('📦 Available Gemini models for generateContent:\n')
  geminiModels.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name}`)
    console.log(`   Display: ${m.displayName}`)
    console.log(`   Description: ${m.description?.substring(0, 80)}...`)
    console.log('')
  })
  
  // Test the first one that looks like flash
  const flashModel = geminiModels.find(m => 
    m.name.toLowerCase().includes('flash') && 
    m.name.toLowerCase().includes('1.5')
  ) || geminiModels.find(m => m.name.toLowerCase().includes('flash'))
  
  if (flashModel) {
    console.log(`\n🧪 Testing: ${flashModel.name}`)
    const url = `https://generativelanguage.googleapis.com/v1/${flashModel.name}:generateContent?key=${apiKey}`
    
    try {
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: 'Hello!' }] }]
      }, { headers: { 'Content-Type': 'application/json' } })
      
      console.log(`✅ SUCCESS! Use this model: ${flashModel.name}`)
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`)
    }
  }
}

listAndTestModels()
