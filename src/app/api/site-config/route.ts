import { isAdminRequest } from "../../../lib/admin-auth";
import { getStoredConfig, saveStoredConfig } from "../../../lib/config-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(
      { config: await getStoredConfig(), mode: "published" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not load site controls" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { config?: unknown };
    const config = await saveStoredConfig(body.config);
    return Response.json({
      ok: true,
      config,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not save site controls" },
      { status: 500 },
    );
  }
}
