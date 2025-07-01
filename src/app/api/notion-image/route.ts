import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) {
    return new NextResponse("Missing src", { status: 400 });
  }

  // Only allow Notion-hosted images for security
  if (!/^https:\/\/(www\.)?notion-static\.com\//.test(src) && !/^https:\/\/s3\.us-west-2\.amazonaws\.com\/secure\.notion-static\.com\//.test(src)) {
    return new NextResponse("Invalid image source", { status: 403 });
  }

  // Fetch the image from Notion
  const notionRes = await fetch(src);
  if (!notionRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  // Set cache headers for CDN (1 day)
  const headers = new Headers(notionRes.headers);
  headers.set("Cache-Control", "public, max-age=86400, immutable");

  // Return the proxied image
  return new NextResponse(notionRes.body, {
    status: notionRes.status,
    headers,
  });
}
