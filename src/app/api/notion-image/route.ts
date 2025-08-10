import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { notion } from "@/app/lib/notion";
import { BlockObjectResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function formatBlockId(id: string) {
  if (id.includes("-")) return id;
  return id.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

async function getNotionImageUrl(blockId: string): Promise<string | null> {
  try {
    const formattedId = formatBlockId(blockId);
    console.log('Fetching Notion block with ID:', formattedId);

    const block = await notion.blocks.retrieve({ block_id: formattedId }) as BlockObjectResponse;
    console.log('Retrieved block type:', block.type);

    if (block.type === "image") {
      const imageBlock = block as ImageBlockObjectResponse;
      if (imageBlock.image.type === "external") {
        return imageBlock.image.external.url;
      }
      if (imageBlock.image.type === "file") {
        return imageBlock.image.file.url;
      }
    }
    return null;
  } catch (err) {
    console.error("Error retrieving Notion block:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const blockId = req.nextUrl.searchParams.get("blockId");

  if (!blockId) {
    console.error("Missing blockId in request");
    return new NextResponse("Missing blockId", { status: 400 });
  }

  const src = await getNotionImageUrl(blockId);

  if (!src) {
    console.error(`Failed to resolve image URL for block ${blockId}`);
    return new NextResponse("Could not resolve image URL", { status: 404 });
  }

  const headers: HeadersInit = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.notion.so",
    "Origin": "https://www.notion.so",
    "Vary": "Accept, Accept-Encoding, X-Notion-Block-ID",
    "X-Notion-Block-ID": blockId
  };

  const notionRes = await fetch(src, { headers });
  if (!notionRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  const responseHeaders = new Headers(notionRes.headers);
  responseHeaders.set("Cache-Control", "private, no-cache, must-revalidate");
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Vary", "Accept, Accept-Encoding, X-Notion-Block-ID");
  responseHeaders.set("X-Notion-Block-ID", blockId);

  return new NextResponse(notionRes.body, {
    status: notionRes.status,
    headers: responseHeaders,
  });
}
