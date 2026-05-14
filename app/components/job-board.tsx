'use client'

import { useState, useMemo, useEffect } from 'react'
import data from '@/data/index.json'
import { LinkListItem } from './link-list-item'
import { EmptyState } from './empty-state'

interface Entry {
  name: string
  domain: string
  portal: boolean
  industry: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ALL_INDUSTRIES = [...new Set((data as Entry[]).map((e) => e.industry))].sort()

export function JobBoard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [portalsOnly, setPortalsOnly] = useState(false)
  const [entries, setEntries] = useState<Entry[]>(() => data as Entry[])

  useEffect(() => {
    setEntries(shuffle(data as Entry[]))
  }, [])

  const filtered = useMemo(() => {
    let result = entries
    if (portalsOnly) {
      result = result.filter((entry) => entry.portal)
    }
    if (selectedIndustry) {
      result = result.filter((entry) => entry.industry === selectedIndustry)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((entry) => entry.name.toLowerCase().includes(q))
    }
    return result
  }, [entries, searchQuery, selectedIndustry, portalsOnly])

  const getEntryUrl = (entry: Entry): string => {
    if (entry.portal) {
      return `https://${entry.domain}`
    }
    return `https://www.google.com/search?q=${encodeURIComponent(entry.name + ' Careers')}`
  }

  return (
    <div className="w-[75vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Better Tech Job Portal
        </h1>
        <p className="text-zinc-500 mt-1.5">
          Discover tech companies and job platforms — find where to apply next
        </p>
      </header>

      <div className="relative mb-6">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          suppressHydrationWarning
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search companies and job portals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setPortalsOnly(!portalsOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            portalsOnly
              ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          Portals only
        </button>
        <span className="text-zinc-300 mx-1">|</span>
        <button
          onClick={() => setSelectedIndustry(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !selectedIndustry
              ? 'bg-zinc-900 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All
        </button>
        {ALL_INDUSTRIES.map((industry) => (
          <button
            key={industry}
            onClick={() => setSelectedIndustry(selectedIndustry === industry ? null : industry)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedIndustry === industry
                ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500">
          Showing{' '}
          <span className="font-medium text-zinc-700">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'entry' : 'entries'}
        </p>
        {(searchQuery || selectedIndustry || portalsOnly) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedIndustry(null); setPortalsOnly(false); }}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((entry) => (
            <LinkListItem key={entry.name} name={entry.name} domain={entry.domain} href={getEntryUrl(entry)} />
          ))}
        </div>
      )}
    </div>
  )
}
