'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, useInView, useAnimation, useReducedMotion, Variants } from 'framer-motion'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}

const makeVariants = (direction: Props['direction']): Variants => {
  const offsets = {
    up:    { y: 12, x: 0 },
    left:  { y: 0,  x: -12 },
    right: { y: 0,  x: 12 },
    none:  { y: 0,  x: 0 },
  }
  const { x, y } = offsets[direction ?? 'up']
  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1, x: 0, y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }
}

export function ScrollReveal({ children, delay = 0, className, direction = 'up' }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const controls = useAnimation()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (inView || reducedMotion) controls.start('visible')
    else controls.set('hidden')
  }, [inView, controls, reducedMotion])

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={controls}
      variants={reducedMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { duration: 0 } } } : makeVariants(direction)}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
