import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 flex items-center px-1 border-2 border-gray-300 dark:border-gray-600"
      aria-label="Toggle theme"
    >
      {/* Sliding circle */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 30 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? (
          <HiMoon className="text-sm text-indigo-600" />
        ) : (
          <HiSun className="text-sm text-yellow-500" />
        )}
      </motion.div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <HiSun className={`text-xs ${!isDark ? 'opacity-0' : 'opacity-50 text-gray-400'}`} />
        <HiMoon className={`text-xs ${isDark ? 'opacity-0' : 'opacity-50 text-gray-500'}`} />
      </div>
    </button>
  );
}
