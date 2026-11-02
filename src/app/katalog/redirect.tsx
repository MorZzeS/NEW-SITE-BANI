'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { withBasePath } from '@/lib/site-path'

export function KatalogRedirect() {
  useEffect(() => {
    window.location.replace(withBasePath('/katalog/bani'))
  }, [])

  return (
    <main className="site-container min-h-[50vh] py-32 text-center">
      <h1 className="text-3xl font-bold text-cream">Каталог мобильных бань</h1>
      <p className="mt-4 text-cream/70">Переходим к моделям бань.</p>
      <Link className="btn-primary mt-6 inline-flex" href="/katalog/bani">Открыть каталог бань</Link>
    </main>
  )
}
