import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

export default function SectionHeader({ title, subtitle, linkText, linkUrl }) {
  return (
    <Reveal className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-2xl">
        <div className="w-12 h-1 bg-pink-button mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
        {subtitle && <p className="text-text-muted text-[15px] md:text-base">{subtitle}</p>}
      </div>
      {linkText && linkUrl && (
        <Link 
          to={linkUrl} 
          className="group flex items-center gap-2 text-pink font-medium hover:text-pink-hover transition-colors whitespace-nowrap"
        >
          {linkText}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  )
}
