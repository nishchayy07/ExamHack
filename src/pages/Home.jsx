import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLightningBolt, HiOutlineBookOpen, HiOutlineUserGroup, HiArrowRight, HiMenu, HiX } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import ThemeToggleSwitch from '../components/ThemeToggleSwitch'
import { useAuth } from '../context/AuthContext'
import glassCards from '../assets/glass-cards.png'
import studentJuggling from '../assets/student-juggling.png'
import ProfileDropdown from '../components/ProfileDropdown'

// Scrolling Words Component with enhanced animation
const ScrollingWords = () => {
  const [index, setIndex] = useState(0)
  const words = ['efficient', 'simpler', 'smart', 'automated', 'better']

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[1.2em] relative inline-flex items-baseline justify-start ml-3 overflow-visible min-w-[240px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 50, opacity: 0, rotateX: -20 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -50, opacity: 0, rotateX: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic font-light absolute top-[0.1em] left-0 text-left w-full"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { currentUser, loginWithGoogle, logout } = useAuth()
  const [examType, setExamType] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const scrollToForm = () => {
    const formElement = document.querySelector('form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  // Pre-load common university codes if needed, or keep simple

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!courseCode.trim() || !examType) return
    setIsLoading(true)
    navigate('/dashboard', {
      state: {
        courseCode: courseCode.toUpperCase(),
        examType
      }
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] relative overflow-x-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-black dark:bg-white text-white dark:text-black w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all">EH</div>
            <span className="hidden sm:inline dark:text-white">ExamHack</span>
          </div>



          <div className="flex items-center gap-4 ml-2">
            <ThemeToggleSwitch />
            {!currentUser ? (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <FcGoogle className="text-xl" />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <ProfileDropdown />
            )}
            <button className="md:hidden text-2xl dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-6xl mx-auto relative z-10 min-h-[90vh]">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={scrollToForm}
          className="bg-gray-50 dark:bg-gray-800 px-5 py-2 rounded-full text-sm font-medium mb-10 inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <span>🚀 Now it is time to study smarter</span>
          <HiArrowRight className="text-gray-400" />
        </motion.div>

        {/* Decorative Student Image */}
        <div className="absolute -left-8 top-[8%] hidden xl:block opacity-70 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
          <img
            src={studentJuggling}
            alt="Student Juggling"
            className="w-72 h-72 object-contain dark:invert transition-all duration-300"
          />
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1] relative z-10">
          Your AI-powered <br />
          exam prep assistant
        </h1>

        {/* Animated Subheading */}
        <div className="text-3xl md:text-6xl text-gray-900 dark:text-white mb-12 flex items-center justify-center font-medium md:h-24">
          <span>makes studying</span>
          <ScrollingWords />
        </div>

        <div className="mb-12 max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            The AI-powered assistant that scrapes past papers, analyzes patterns, and generates your ultimate cheat sheet in seconds.
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400">
            No more exam stress - just enter your course code and let AI do the heavy lifting for you! 🎯
          </p>
        </div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full max-w-lg flex flex-col gap-4 mb-20 relative z-20 bg-white dark:bg-[#0a0a0a] p-2 rounded-3xl border border-gray-100 dark:border-gray-900"
        >
          <div className="relative group">
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="Enter Subject Code (e.g., UCS503)"
              className="input-clean pl-14"
              disabled={isLoading}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
              <HiOutlineBookOpen className="text-xl" />
            </div>
          </div>

          <div className="relative">
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="input-clean appearance-none cursor-pointer hover:border-black dark:hover:border-white transition-colors"
              disabled={isLoading}
            >
              <option value="" disabled>Select Exam Type</option>
              <option value="MST">MST (Mid Semester)</option>
              <option value="EST">EST (End Semester)</option>
              <option value="AUX">AUX (Auxiliary)</option>
              <option value="SUMMER_MST">Summer (MST)</option>
              <option value="SUMMER_EST">Summer (EST)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !courseCode.trim()}
            className="btn-solid w-full text-lg py-4 shadow-xl shadow-gray-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <>
                <HiLightningBolt className="text-xl text-yellow-300" /> Generate Cheat Sheet
              </>
            )}
          </button>
        </motion.form>



        <div className="absolute bottom-[20%] right-[5%] hidden xl:block opacity-60 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80L100 40L180 80L100 120L20 80Z" stroke="black" className="dark:stroke-white transition-colors" strokeWidth="2" fill="white" />
            <path d="M100 120V160C100 170 140 170 140 160V100" stroke="black" className="dark:stroke-white transition-colors" strokeWidth="2" />
            <circle cx="180" cy="80" r="4" fill="black" className="dark:fill-white transition-colors" />
          </svg>
        </div>



      </main>

    </div>
  )
}

