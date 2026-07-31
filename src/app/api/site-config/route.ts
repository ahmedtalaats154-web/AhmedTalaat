import { isAdminRequest } from "../../../lib/admin-auth";
import { getStoredConfig, saveStoredConfig, type ConfigMode } from "../../../lib/config-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const requestedMode = new URL(request.url).searchParams.get("mode");
    const mode: ConfigMode = requestedMode === "draft" ? "draft" : "published";
    if (mode === "draft" && !isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json(
      { config: await getStoredConfig(mode), mode },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not load site controls" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as { config?: unknown; mode?: ConfigMode };
    const mode: ConfigMode = body.mode === "draft" ? "draft" : "published";
    const config = await saveStoredConfig(body.config, mode);
    if (mode === "published") await saveStoredConfig(config, "draft");
    return Response.json({ ok: true, config, mode, updatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not save site controls" }, { status: 500 });
  }
}

export const PUT = POST;
