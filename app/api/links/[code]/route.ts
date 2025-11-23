// app/[code]/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const { code } = params;

  const result = await sql`SELECT * FROM links WHERE code = ${code}`;

  if (!result?.rowCount) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Redirect to the original URL
  return NextResponse.redirect(result.rows[0].url);
}
