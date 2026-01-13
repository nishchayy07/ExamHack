import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileDropdown() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!currentUser) return null

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full pr-4 pl-1 py-1 transition-all group"
      >
        <img 
          src={currentUser.photoURL} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" 
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
          {currentUser.displayName?.split(' ')[0]}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={() => {
              navigate('/profile')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            My Research
          </button>
          <button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
