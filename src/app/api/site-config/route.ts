import {
  DEFAULT_SITE_CONFIG,
  withMediaOrigin,
} from "../../../lib/site-config";

const MEDIA_ORIGIN = "https://play-edit-creator-2026.marklix-eg.chatgpt.site";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      config: withMediaOrigin(DEFAULT_SITE_CONFIG, MEDIA_ORIGIN),
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
