import { Fragment } from "react";
import { getBlocks, getProduction, getPageBySlug } from "@/app/lib/actions";
import { renderBlock } from "@/app/lib/renderer";

export async function generateStaticParams() {
  const database = await getProduction();

  return database!.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage ({
    params,
}: {
    params: Promise<{slug: string}>;
}) {
    const { slug } = await params;
    const post = await getPageBySlug(slug);
    const blockId = post![0].id;
    const blocks = await getBlocks(blockId);

    return (<div className="main">
        <h2>{post![0].title}</h2>
        <p>{post![0].description}</p>
        {blocks?.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
    </div>
    )
};
