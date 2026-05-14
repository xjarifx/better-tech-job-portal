export function EmptyState() {
  return (
    <div className="text-center py-20">
      <svg
        className="w-16 h-16 mx-auto text-zinc-200 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <p className="text-zinc-400 font-medium text-base">No companies match your search</p>
      <p className="text-zinc-300 text-sm mt-1">Try a different search term</p>
    </div>
  )
}
