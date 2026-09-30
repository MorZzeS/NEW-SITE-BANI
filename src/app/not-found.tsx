import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Страница не найдена',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-cream mb-3">Страница не найдена</h1>
        <p className="text-cream/60 mb-8 max-w-sm mx-auto">
          Такой страницы не существует или она была перемещена
        </p>
        <Link href="/" className="btn-primary px-8 py-3.5">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>
    </div>
  )
}
