import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Helper: Fetch the latest image URL for a block from Notion API
async function getNotionImageUrl(blockId: string): Promise<string | null> {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) throw new Error("Missing NOTION_TOKEN env variable");

  // Fetch block info from Notion API
  const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    cache: "no-store"
  });

  if (!res.ok) return null;
  const data = await res.json();

  // Find the image URL depending on block type
  if (data.type === "image") {
    if (data.image.type === "external") return data.image.external.url;
    if (data.image.type === "file") return data.image.file.url;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const blockId = req.nextUrl.searchParams.get("blockId");
  if (!blockId) {
    return new NextResponse("Missing blockId", { status: 400 });
  }

  // 1. Get the latest image URL from Notion
  const src = await getNotionImageUrl(blockId);
  if (!src) {
    return new NextResponse("Could not resolve image URL", { status: 404 });
  }

  // 2. Only allow Notion-hosted images for security
  if (
    !/^https:\/\/(www\.)?notion-static\.com\//.test(src) &&
    !/^https:\/\/s3\.us-west-2\.amazonaws\.com\/secure\.notion-static\.com\//.test(src)
  ) {
    return new NextResponse("Invalid image source", { status: 403 });
  }

  // 3. Proxy the image
  const headers: HeadersInit = {
    "User-Agent": req.headers.get("user-agent") || "Mozilla/5.0",
  };
  const notionRes = await fetch(src, { headers });

  if (!notionRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  // 4. Set cache headers for CDN (1 day)
  const responseHeaders = new Headers(notionRes.headers);
  responseHeaders.set("Cache-Control", "public, max-age=86400, immutable");

  return new NextResponse(notionRes.body, {
    status: notionRes.status,
    headers: responseHeaders,
  });
}
