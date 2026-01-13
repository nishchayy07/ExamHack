import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaDownload, FaHome, FaFire, FaTrophy } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { courseCode, examType, data } = location.state || {}
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Save to history when results load
  useEffect(() => {
    const saveToHistory = async () => {
      if (currentUser && data && courseCode) {
        try {
           await addDoc(collection(db, "users", currentUser.uid, "history"), {
             courseCode,
             examType: examType || 'EST',
             timestamp: serverTimestamp(),
             summary: `Analysis for ${courseCode}`,
             data: data // Optional: store full data to avoid re-fetching
           })
           console.log("Research saved to history")
        } catch (error) {
           console.error("Error saving history:", error)
        }
      }
    }
    
    saveToHistory()
  }, [currentUser, data, courseCode, examType])

  if (!data) {
    navigate('/')
    return null
  }

  const { topQuestions = [], topicWeightage = [], fromCache = false } = data

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      const response = await axios.post('http://localhost:5000/api/download-pdf', {
        courseCode,
        topQuestions,
        topicWeightage
      }, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ExamHack_${courseCode}_CheatSheet.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float-delay-1"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <HiSparkles className="text-green-400" />
            <span className="text-sm text-green-300">
              {fromCache ? 'Analysis Complete! (From Cache ⚡)' : 'Analysis Complete!'}
            </span>
          </div>
          <h1 className="text-5xl font-display font-bold mb-3">
            <span className="gradient-text">{courseCode}</span> Cheat Sheet
          </h1>
          <p className="text-gray-400 text-lg">Your AI-powered exam preparation guide</p>
          
          <div className="flex gap-4 justify-center mt-6">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className={isDownloading ? 'animate-bounce' : ''} />
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <FaHome />
              New Analysis
            </button>
          </div>
        </motion.div>

        {/* Top 10 Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-accent-pink flex items-center justify-center">
              <FaFire className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold">Top 10 Most Repeated Questions</h2>
          </div>

          <div className="space-y-4">
            {topQuestions.map((question, index) => (
              <QuestionCard
                key={index}
                rank={index + 1}
                question={question.text}
                frequency={question.frequency}
                years={question.years}
                topic={question.topic}
                subtopic={question.subtopic}
              />
            ))}
          </div>
        </motion.div>

        {/* Topic Weightage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
              <FaTrophy className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold">Topic Weightage Analysis</h2>
          </div>

          <div className="glass-card p-8">
            <div className="space-y-6">
              {topicWeightage.map((topic, index) => (
                <TopicBar
                  key={index}
                  topic={topic.name}
                  percentage={topic.percentage}
                  count={topic.count}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bhaichara Study Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass-card p-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HiSparkles className="text-primary-400" />
            Bhai Sun, Exam Tips 💯
          </h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">🔥</span>
              <div>
                <p className="font-bold text-white text-base">Top 5 Questions Are Your Best Friends</p>
                <p className="text-sm text-gray-400 mt-1">Bhai dekh, yeh toh pakka kar le - almost confirm hai paper mein aayenge!</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">💪</span>
              <div>
                <p className="font-bold text-white text-base">High Weightage Topics First</p>
                <p className="text-sm text-gray-400 mt-1">Agar time kam hai, toh jo topics ka weightage zyada hai woh pehle padh le - maximum marks mil jayenge</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">📚</span>
              <div>
                <p className="font-bold text-white text-base">Repeat Questions = Easy Marks</p>
                <p className="text-sm text-gray-400 mt-1">Pass hona hai toh jo questions multiple years mein aaye hain, woh toh ratt hi ja bhai - repeat hone ke chances bahut high hain</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">⚡</span>
              <div>
                <p className="font-bold text-white text-base">Frequency 4+ = Must Do</p>
                <p className="text-sm text-gray-400 mt-1">Pro tip: Yeh wale questions ko priority de, baaki time mile toh kar lena</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">🎯</span>
              <div>
                <p className="font-bold text-white text-base">Last Minute Strategy</p>
                <p className="text-sm text-gray-400 mt-1">Last minute hai kya? Toh #1, #2, #3 questions ko achhe se samajh le aur practice kar - bas ho jayega!</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

function QuestionCard({ rank, question, frequency, years, topic, subtopic }) {
  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-600 to-orange-800'
    return 'from-primary-500 to-accent-purple'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="glass-card p-6 cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <span className="text-xl font-bold text-white">#{rank}</span>
        </div>
        <div className="flex-1">
          {(topic || subtopic) && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {topic && (
                <span className="inline-block px-3 py-1 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-semibold border border-accent-purple/30">
                  {topic}
                </span>
              )}
              {subtopic && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold border border-primary-500/30">
                  {subtopic}
                </span>
              )}
            </div>
          )}
          <p className="text-lg font-medium mb-2 leading-relaxed">{question}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
              <FaFire className="inline mr-1" />
              Appeared {frequency}x
            </span>
            {years && (
              <span className="text-gray-500">
                Years: {years.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TopicBar({ topic, percentage, count }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{topic}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{count} questions</span>
          <span className="text-sm font-bold gradient-text">{percentage}%</span>
        </div>
      </div>
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-bg"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
