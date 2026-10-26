'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CheckCircle, FileText, Hammer, Home, Settings, Truck, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import styles from './ProcessStorySection.module.css'

type ProcessStep = {
  icon: LucideIcon
  step: string
  title: string
  description: string
}

// The copy mirrors the approved process language used by HowItWorksSection.
// Keep this list factual and editorial; it is intentionally not a construction diagram.
const steps: ProcessStep[] = [
  {
    icon: FileText,
    step: '01',
    title: 'Заявка',
    description: 'Звоните или пишете нам напрямую. Мы отвечаем на вопросы и уточняем задачу.',
  },
  {
    icon: Settings,
    step: '02',
    title: 'Согласование',
    description: 'Выбираем модель, планировку и комплектацию. Согласовываем проект и договор.',
  },
  {
    icon: Hammer,
    step: '03',
    title: 'Производство',
    description: 'Баня собирается в производственном цехе из отборного пиломатериала под контролем мастера.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Доставка',
    description: 'Доставляем транспортом компании по Москве и регионам Центральной России, заранее согласовав дату.',
  },
  {
    icon: Home,
    step: '05',
    title: 'Установка',
    description: 'После установки баня подготовлена к подключению коммуникаций и дальнейшему использованию.',
  },
  {
    icon: CheckCircle,
    step: '06',
    title: 'Готово',
    description: 'Вы принимаете баню и получаете документы и гарантию по договору.',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function ProcessStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-90px' })
  const reducedMotion = useReducedMotion()

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="process-story-title">
      <div className="site-container">
        <motion.div
          className={styles.intro}
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={reducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease }}
        >
          <div className="section-tag">Процесс заказа</div>
          <h2 id="process-story-title" className={styles.title}>Как создаётся ваша баня</h2>
          <p className={styles.lead}>
            От первого разговора до установки — понятные шаги и согласованные решения.
          </p>
        </motion.div>

        <ol className={styles.timeline} aria-label="Этапы заказа и установки">
          {steps.map(({ icon: Icon, step, title, description }, index) => (
            <motion.li
              key={step}
              className={styles.step}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.08 * index, ease }}
            >
              <div className={styles.stepMarker} aria-hidden="true">
                <span>{step}</span>
                <Icon className={styles.icon} strokeWidth={1.7} />
              </div>
              <div className={styles.copy}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
