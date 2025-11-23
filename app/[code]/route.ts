import { NextResponse } from "next/server";
import { db } from "../api/links/route"; // import in-memory db

export async function GET(req: Request, context: { params: { code: string } | Promise<{ code: string }> }) {
  const params = await context.params; // unwrap Promise
  const code = params.code;

  // find link in db
  const link = db.find((item) => item.code === code);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // update clicks and lastClicked
  link.clicks += 1;
  link.lastClicked = new Date().toISOString();

  // redirect to original URL
  return NextResponse.redirect(link.longUrl);
}
