'use client'

import { useState } from 'react'
import { getLogoColor, getInitials } from './logo-utils'

interface Props {
  name: string
  domain: string
  href: string
}

export function LinkCard({ name, domain, href }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-3">
        {imgError ? (
          <div
            className={`w-10 h-10 rounded-lg ${getLogoColor(name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}
          >
            {getInitials(name)}
          </div>
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt={`${name} logo`}
            className="w-10 h-10 rounded-lg object-contain border border-zinc-100 shrink-0"
            onError={() => setImgError(true)}
          />
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-zinc-900 truncate">{name}</h3>
          <p className="text-xs text-zinc-400 truncate">{domain}</p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-indigo-400 hover:bg-indigo-500 transition-colors rounded-lg px-4 py-2 mt-auto"
      >
        View careers
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}
