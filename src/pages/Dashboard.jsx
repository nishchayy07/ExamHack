import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { HiDownload, HiDocumentText, HiLightBulb, HiChartBar } from 'react-icons/hi'
import axios from 'axios'

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const courseCode = location.state?.courseCode || ''
  const examType = location.state?.examType || 'ALL'
  
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Initializing...')
  const [error, setError] = useState(null)

  const steps = [
    { id: 1, title: 'Scraping Papers', icon: <HiDownload />, description: 'Fetching question papers from library' },
    { id: 2, title: 'Processing PDFs', icon: <HiDocumentText />, description: 'Extracting text from documents' },
    { id: 3, title: 'AI Analysis', icon: <HiLightBulb />, description: 'Analyzing patterns with AI' },
    { id: 4, title: 'Generating Results', icon: <HiChartBar />, description: 'Creating your cheat sheet' },
  ]

  useEffect(() => {
    if (!courseCode) {
      navigate('/')
      return
    }

    const processExam = async () => {
      try {
        // Step 1: Scrape papers
        setCurrentStep(0)
        setStatus('Connecting to library...')
        setProgress(10)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStatus('Searching for papers...')
        setProgress(20)
        
        const scrapeResponse = await axios.post('http://localhost:5000/api/scrape', {
          courseCode,
          examType
        })
        
        setProgress(25)
        setCurrentStep(1)
        
        // Step 2: Process PDFs
        setStatus('Processing PDFs...')
        setProgress(40)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setProgress(50)
        
        setCurrentStep(2)
        
        // Step 3: AI Analysis
        setStatus('Running AI analysis...')
        setProgress(60)
        
        const analyzeResponse = await axios.post('http://localhost:5000/api/analyze', {
          courseCode,
          pdfPaths: scrapeResponse.data.pdfPaths
        })
        
        setProgress(80)
        setCurrentStep(3)
        
        // Step 4: Generate results
        setStatus('Generating cheat sheet...')
        setProgress(95)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProgress(100)
        
        // Navigate to results
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              courseCode,
              examType,
              data: analyzeResponse.data 
            } 
          })
        }, 500)
        
      } catch (err) {
        console.error('Error:', err)
        setError(err.response?.data?.message || 'An error occurred. Please try again.')
      }
    }

    processExam()
  }, [courseCode, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-glow"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float-delay-1"></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-3">
            Processing <span className="gradient-text">{courseCode}</span>
          </h1>
          <p className="text-gray-400">Sit back and relax while we analyze your exam papers</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-300">{status}</span>
            <span className="text-sm font-bold gradient-text">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-bg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 ${
                index < currentStep ? 'border-primary-500/50' : 
                index === currentStep ? 'border-primary-500 shadow-lg shadow-primary-500/20' : 
                'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  index < currentStep ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-primary-500/20 text-primary-400 animate-pulse' :
                  'bg-white/5 text-gray-500'
                }`}>
                  {index < currentStep ? <FaCheckCircle /> : 
                   index === currentStep ? <FaSpinner className="animate-spin" /> :
                   step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bhai vibes while waiting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-base font-bold text-white mb-1">
            AI is analyzing your papers
          </p>
          <p className="text-sm text-gray-400">
            Bhai chill kar, multiple years ke papers dekh raha hai - tere liye best questions nikaal raha hai! 💯
          </p>
        </motion.div>
      </div>
    </div>
  )
}
