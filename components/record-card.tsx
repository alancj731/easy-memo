import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Trash2 } from "lucide-react"
import type { Record } from "@/src/app/page"

interface RecordCardProps {
  record: Record
  searchQuery?: string
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/30 text-primary-foreground px-1 rounded font-medium">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function RecordCard({ record, searchQuery }: RecordCardProps) {
  const formattedDate = new Date(record.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight font-semibold group-hover:text-primary transition-colors">
              {highlightMatch(record.title, searchQuery || "")}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button
            className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      {record.content && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {highlightMatch(record.content, searchQuery || "")}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
