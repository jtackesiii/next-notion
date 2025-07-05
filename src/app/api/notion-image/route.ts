import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { notion } from "@/app/lib/notion";

function formatBlockId(id: string) {
  if (id.includes("-")) return id;
  return id.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    "$1-$2-$3-$4-$5"
  );
}

async function getNotionImageUrl(blockId: string): Promise<string | null> {
  try {
    const formattedId = formatBlockId(blockId);
    const block = await notion.blocks.retrieve({ block_id: formattedId });
    if ("type" in block && block.type === "image" && "image" in block) {
      const imageBlock = block as {
        type: "image";
        image: {
          type: "external" | "file";
          external?: { url: string };
          file?: { url: string };
        };
      };
      if (imageBlock.image.type === "external" && imageBlock.image.external) {
        return imageBlock.image.external.url;
      }
      if (imageBlock.image.type === "file" && imageBlock.image.file) {
        return imageBlock.image.file.url;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const blockId = req.nextUrl.searchParams.get("blockId");
  if (!blockId) {
    return new NextResponse("Missing blockId", { status: 400 });
  }

  const src = await getNotionImageUrl(blockId);
  if (!src) {
    return new NextResponse("Could not resolve image URL", { status: 404 });
  }

  if (
    !/^https:\/\/(www\.)?notion-static\.com\//.test(src) &&
    !/^https:\/\/s3\.us-west-2\.amazonaws\.com\/secure\.notion-static\.com\//.test(src)
  ) {
    return new NextResponse("Invalid image source", { status: 403 });
  }

  const headers: HeadersInit = {
    "User-Agent": req.headers.get("user-agent") || "Mozilla/5.0",
    "Referer": "https://www.notion.so/",
  };
  const notionRes = await fetch(src, { headers });

  if (!notionRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  const responseHeaders = new Headers(notionRes.headers);
  responseHeaders.set("Cache-Control", "public, max-age=86400, immutable");

  return new NextResponse(notionRes.body, {
    status: notionRes.status,
    headers: responseHeaders,
  });
}
