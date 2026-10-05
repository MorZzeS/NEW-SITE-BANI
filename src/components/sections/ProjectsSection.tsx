'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { projects } from '@/data'

export function ProjectsSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="section-tag mb-3">Реализованные объекты</div>
            <h2 className="text-4xl font-bold text-cream">Наши работы</h2>
          </div>
          <Link href="/nashi-raboty" className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap">
            Все проекты <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.slice(0, 4).map((project, i) => (
            <Link href={`/nashi-raboty/${project.slug}`} key={project.id} className="group block">
              <div className="glass-card overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/80 to-transparent" />
                  <div className="theme-on-image absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 text-xs text-cream/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {project.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {project.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gold-400/80 font-semibold mb-1">{project.model}</div>
                  <h3 className="text-base font-bold text-cream mb-2 group-hover:text-gold-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-cream/60 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 glass rounded-lg text-[10px] text-cream/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
