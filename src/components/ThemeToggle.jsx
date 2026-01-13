import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <HiSun className="text-2xl text-yellow-500" />
        ) : (
          <HiMoon className="text-2xl text-indigo-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
