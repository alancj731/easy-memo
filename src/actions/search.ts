"use server"

import { neon } from "@neondatabase/serverless"

export interface Record {
  id: number
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

export interface SearchResult {
  records: Record[]
  total: number
  query: string
}

export async function searchRecords(query: string): Promise<SearchResult> {
  const sql = neon(process.env.DATABASE_URL!)
  
  if (!query.trim()) {
    // Return all records if no search query
    const records = await sql`
      SELECT id, title, content, created_at, updated_at 
      FROM records 
      ORDER BY created_at DESC
    `
    return {
      records: records as Record[],
      total: records.length,
      query: ""
    }
  }

  // Search using ILIKE with %query% pattern for partial matching
  const searchPattern = `%${query}%`
  
  const records = await sql`
    SELECT id, title, content, created_at, updated_at 
    FROM records 
    WHERE title ILIKE ${searchPattern} 
       OR content ILIKE ${searchPattern}
    ORDER BY 
      CASE 
        WHEN title ILIKE ${searchPattern} THEN 1 
        ELSE 2 
      END,
      created_at DESC
  `

  return {
    records: records as Record[],
    total: records.length,
    query
  }
}
