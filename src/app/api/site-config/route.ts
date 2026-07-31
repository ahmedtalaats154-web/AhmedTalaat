import { DEFAULT_SITE_CONFIG } from "../../../lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      config: DEFAULT_SITE_CONFIG,
      mode: "published",
      preview: true,
    },
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
