import { del, list } from "@vercel/blob";
import { isAdminRequest } from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const result = await list({ prefix: "media/", limit: 1000 });
  return Response.json({ blobs: result.blobs });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  if (!body?.url) return Response.json({ error: "A media URL is required" }, { status: 400 });
  await del(body.url);
  return Response.json({ ok: true });
}

