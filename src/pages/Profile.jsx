import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore'
import { HiArrowLeft, HiSearch, HiClock, HiCalendar } from 'react-icons/hi'
import { VscGithub } from 'react-icons/vsc'

export default function Profile() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
      return
    }

    const fetchHistory = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false)
        }, 3000) // 3 second timeout

        const q = query(
          collection(db, "users", currentUser.uid, "history"),
          orderBy("timestamp", "desc"),
          limit(50)
        )
        const querySnapshot = await getDocs(q)
        
        clearTimeout(timeoutId) // Clear timeout if query completes
        
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setHistory(historyData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching history:", error)
        setLoading(false) // Set loading to false even on error
      }
    }

    fetchHistory()
  }, [currentUser, navigate])

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date)
  }

  const navigateToResult = (item) => {
    navigate('/dashboard', { 
      state: { 
        courseCode: item.courseCode,
        examType: item.examType || 'EST' 
      } 
    })
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
             <HiArrowLeft className="text-2xl" />
             <span>Back to Home</span>
          </div>
          <div className="flex items-center gap-3">
             <img 
               src={currentUser.photoURL} 
               alt="Profile" 
               className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" 
             />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName} 
              className="relative w-32 h-32 rounded-full border-4 border-white dark:border-black shadow-2xl object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{currentUser.displayName}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{currentUser.email}</p>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Student Account
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HiClock className="text-gray-400" />
              Recent Research
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {history.length} items found
            </span>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
               <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <HiSearch className="text-2xl text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No research yet</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-6">Start by searching for a course code!</p>
               <button 
                 onClick={() => navigate('/')}
                 className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-all"
               >
                 Start Research
               </button>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigateToResult(item)}
                  className="group relative bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center font-bold border border-blue-100 dark:border-blue-900/50">
                      <span className="text-xs uppercase opacity-70">CODE</span>
                      <span className="text-lg">{item.courseCode}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1 flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                        {item.title || `${item.courseCode} Research`}
                        <HiArrowRight className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                         <span className="flex items-center gap-1">
                           <HiCalendar className="w-4 h-4" />
                           {formatDate(item.timestamp)}
                         </span>
                         <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium uppercase">
                           {item.examType}
                         </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
