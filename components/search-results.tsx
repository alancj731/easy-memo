"use client"

import { RecordCard } from "./record-card"
import { Ghost, Sparkles } from "lucide-react"
import type { Record } from "@/src/app/page"

interface SearchResultsProps {
  records: Record[]
  total: number
  query: string
  isLoading?: boolean
}

export function SearchResults({ records, total, query, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 rounded-xl bg-card/50 border border-border/50 animate-pulse" />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-5 rounded-2xl bg-muted/50 border border-border/50 mb-6">
          <Ghost className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No records found</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          {query 
            ? `No records matching "${query}". Try a different search term.`
            : "We searched the whole database, nothing found so far ..."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            {query ? (
              <>
                Found <span className="font-semibold text-foreground">{total}</span> record{total !== 1 ? 's' : ''} matching{" "}
                <span className="font-semibold text-primary">"{query}"</span>
              </>
            ) : (
              <>
                Showing all <span className="font-semibold text-foreground">{total}</span> record{total !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        {records.map((record) => (
          <RecordCard key={record.id} record={record} searchQuery={query} />
        ))}
      </div>
    </div>
  )
}
