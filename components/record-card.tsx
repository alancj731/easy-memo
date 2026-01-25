import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Trash2 } from "lucide-react"
import type { Record } from "@/src/app/page"
import { toast } from "sonner"

interface RecordCardProps {
  record: Record
  searchQuery?: string
  onDelete?: (id: number) => void
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

export function RecordCard({ record, searchQuery, onDelete }: RecordCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formattedDate = new Date(record.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const handleDelete = async () => {
    setShowConfirm(false)
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/delete?id=${record.id}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        toast.success("Record deleted successfully")
        onDelete?.(record.id)
      } else {
        toast.error("Failed to delete that record!")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete that record!")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
              onClick={(e) => {
                e.stopPropagation()
                 toast.error("Sorry, you can't delete records for demo.")
              }}
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

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Record</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete "{record.title}"? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-lg border border-[#333] text-gray-300 hover:bg-[#252525] transition-colors"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
