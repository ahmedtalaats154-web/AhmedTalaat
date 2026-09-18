import { isAdminRequest } from "../../../lib/admin-auth";
import { validateEuVisual } from "../../../lib/eu-visual";
import { mergeSiteConfig } from "../../../lib/site-config";
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
    const config = await getStoredConfig(mode);
    if (!isAdminRequest(request)) {
      config.euVisual = { ...config.euVisual, projects: config.euVisual.projects.filter(project => project.published) };
    }
    return Response.json(
      { config, mode },
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
    const incoming = mergeSiteConfig(body.config);
    // An older dashboard tab may not know this new module. Preserve its saved data.
    if (body.config && typeof body.config === "object" && !("euVisual" in body.config)) {
      incoming.euVisual = (await getStoredConfig(mode)).euVisual;
    }
    const validationError = validateEuVisual(incoming.euVisual);
    if (validationError) return Response.json({ error: validationError }, { status: 400 });
    const config = await saveStoredConfig(incoming, mode);
    if (mode === "published") await saveStoredConfig(config, "draft");
    return Response.json({ ok: true, config, mode, updatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not save site controls" }, { status: 500 });
  }
}

export const PUT = POST;
