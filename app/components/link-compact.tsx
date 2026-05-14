interface Props {
  name: string
  href: string
}

export function LinkCompact({ name, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-sm group"
    >
      <span className="font-medium text-zinc-900 flex-1">{name}</span>
      <span className="text-xs text-indigo-400 font-medium group-hover:text-indigo-700 transition-colors">
        View careers
      </span>
      <svg
        className="w-3 h-3 text-zinc-300 shrink-0 group-hover:text-zinc-500 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  )
}
