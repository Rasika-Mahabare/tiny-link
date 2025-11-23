import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  const result = await sql`DELETE FROM links WHERE code = ${code} RETURNING *`;

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
