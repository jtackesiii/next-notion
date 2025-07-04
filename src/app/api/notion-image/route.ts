import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) {
    return new NextResponse("Missing src", { status: 400 });
  }

  // Only allow Notion-hosted images for security
  if (
    !/^https:\/\/(www\.)?notion-static\.com\//.test(src) &&
    !/^https:\/\/s3\.us-west-2\.amazonaws\.com\/secure\.notion-static\.com\//.test(src)
  ) {
    return new NextResponse("Invalid image source", { status: 403 });
  }

  // Forward User-Agent and (optionally) Referer headers
  const headers: HeadersInit = {
    "User-Agent": req.headers.get("user-agent") || "Mozilla/5.0",
    // "Referer": req.headers.get("referer") || "", // Uncomment if needed
  };

  // Fetch the image from Notion with headers
  const notionRes = await fetch(src, { headers });

  if (!notionRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  // Set cache headers for CDN (1 day)
  const responseHeaders = new Headers(notionRes.headers);
  responseHeaders.set("Cache-Control", "public, max-age=86400, immutable");

  return new NextResponse(notionRes.body, {
    status: notionRes.status,
    headers: responseHeaders,
  });
}
