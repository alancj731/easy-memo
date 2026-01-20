"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Database, Sparkles } from "lucide-react"

export interface Record {
  id: number
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

export default function SearchPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error("Search failed")
      }
      
      const result = await response.json()
      setRecords(result.records)
      setTotal(result.total)
      setQuery(result.query)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      console.error("[v0] Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialLoad) {
      handleSearch("")
      setInitialLoad(false)
    }
  }, [handleSearch, initialLoad])

  return (
    <main className="min-h-screen bg-background dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 py-16">

        <div className="space-y-10">
          <SearchForm onSearch={handleSearch} initialQuery={query} />
          <SearchResults 
            records={records} 
            total={total} 
            query={query}
            isLoading={isLoading}
          />
        </div>
        
        <footer className="mt-16 text-end text-sm text-muted-foreground italic">
          <p>created by <span className='hover:text-primary'><a href='https://www.linkedin.com/in/winnipegdatafan/'>jian</a></span></p>
        </footer>
      </div>
    </main>
  )
}
