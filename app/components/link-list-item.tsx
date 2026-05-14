'use client'

import { useState } from 'react'
import { getLogoColor, getInitials } from './logo-utils'

interface Props {
  name: string
  domain: string
  href: string
}

export function LinkListItem({ name, domain, href }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-all duration-200 hover:shadow-md">
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
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-zinc-900">{name}</h3>
        <p className="text-xs text-zinc-400 truncate">{domain}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-400 hover:bg-indigo-500 transition-colors rounded-lg px-4 py-2 ml-2"
      >
        View careers
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}
