"use server"

import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export interface Record {
  id: number
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  
  try {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)
    
    if (!query.trim()) {
      const records = await sql`
        SELECT id, title, content, created_at, updated_at 
        FROM memo
        ORDER BY created_at DESC
      `
      return NextResponse.json({
        records,
        total: records.length,
        query: ""
      })
    }

    const searchPattern = `%${query}%`
    
    const records = await sql`
      SELECT id, title, content, created_at, updated_at 
      FROM memo
      WHERE title ILIKE ${searchPattern} 
         OR content ILIKE ${searchPattern}
      ORDER BY 
        created_at DESC
    `

    return NextResponse.json({
      records,
      total: records.length,
      query
    })
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json(
      { error: "Failed to search records", records: [], total: 0, query },
      { status: 500 }
    )
  }
}
