import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// GET all links
export async function GET() {
  const { rows } = await sql`SELECT * FROM links ORDER BY code ASC`;
  return NextResponse.json(rows);
}

// POST create new link
export async function POST(req: Request) {
  const { longUrl, customCode } = await req.json();
  const code = customCode || Math.random().toString(36).substring(2, 8);

  // check duplicate
  const check = await sql`SELECT * FROM links WHERE code = ${code}`;
  if (check.rowCount > 0) {
    return NextResponse.json({ error: "Code already exists" }, { status: 400 });
  }

  await sql`
    INSERT INTO links (code, url, clicks, lastClicked)
    VALUES (${code}, ${longUrl}, 0, NULL)
  `;

  return NextResponse.json({ code, url: longUrl, clicks: 0, lastClicked: null });
}
