'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  hidden:  { opacity: 0, y: 8 },
  enter:   { opacity: 1, y: 0,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -4,
    transition: { duration: 0.16, ease: [0.55, 0, 1, 0.45] } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={reducedMotion ? { hidden: { opacity: 1 }, enter: { opacity: 1, transition: { duration: 0 } }, exit: { opacity: 1, transition: { duration: 0 } } } : variants}
        initial="hidden"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
