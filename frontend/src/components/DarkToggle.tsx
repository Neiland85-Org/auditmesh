import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function DarkToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const cls = document.documentElement.classList
    if (dark) {
      cls.add('dark')
    } else {
      cls.remove('dark')
    }
  }, [dark])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setDark(v => !v)}
      className="focus-ring inline-flex items-center gap-2 rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <Sun size={16}/> : <Moon size={16}/>}
      </motion.div>
      <span>{dark ? 'Light' : 'Dark'}</span>
    </motion.button>
  )
}
