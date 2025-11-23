import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await sql`SELECT * FROM links ORDER BY id DESC`;
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { code, url } = body;

  if (!code || !url)
    return NextResponse.json({ error: "Code & URL required" }, { status: 400 });

  const check = await sql`SELECT * FROM links WHERE code = ${code}`;

  if (check?.rowCount && check.rowCount > 0) {
    return NextResponse.json({ error: "Code already exists" }, { status: 400 });
  }

  await sql`INSERT INTO links (code, url) VALUES (${code}, ${url})`;
  return NextResponse.json({ message: "Link created" });
}
