"use server";

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 },
    );
  }

  try {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

    const found = await sql`SELECT * FROM memo WHERE id = ${id}`;
    if (found.length === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 },
      );
    }

    const result = await sql`DELETE FROM memo WHERE id = ${id}`;
    console.log("[v0] Delete API result:", result);

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("[v0] Delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 },
    );
  }
}
