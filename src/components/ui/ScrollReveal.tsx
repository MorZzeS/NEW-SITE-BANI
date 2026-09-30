'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}

const makeVariants = (direction: Props['direction']): Variants => {
  const offsets = {
    up:    { y: 32, x: 0 },
    left:  { y: 0,  x: -32 },
    right: { y: 0,  x: 32 },
    none:  { y: 0,  x: 0 },
  }
  const { x, y } = offsets[direction ?? 'up']
  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1, x: 0, y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }
}

export function ScrollReveal({ children, delay = 0, className, direction = 'up' }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={makeVariants(direction)}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
