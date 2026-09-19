import { isAdminRequest } from "../../../lib/admin-auth";
import { getStoredConfig } from "../../../lib/config-store";
import { summarizeProjects } from "../../../lib/eu-visual";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const draft = params.get("mode") === "draft";
  if (draft && !isAdminRequest(request)) return Response.json({ error: "Sign in to preview drafts." }, { status: 401 });
  try {
    const config = await getStoredConfig(draft ? "draft" : "published");
    const eu = config.euVisual;
    const slug = params.get("project");
    if (slug) {
      const project = eu.projects.find(p => p.slug === slug && (draft || p.published));
      if (!project) return Response.json({ error: "This project is not available." }, { status: 404 });
      return Response.json({ project }, { headers: { "Cache-Control": "no-store" } });
    }
    return Response.json({ title: eu.title, headline: eu.headline, description: eu.description, brand: config.identity.brand, theme: config.theme, projects: summarizeProjects(eu, draft) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not load EU Visual. Please try again." }, { status: 500 });
  }
}
