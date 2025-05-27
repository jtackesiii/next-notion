import { Fragment } from "react";
import { getBlocks, getProduction, getPageBySlug } from "@/app/lib/actions";
import { renderBlock } from "@/app/lib/renderer";
import { Heading } from '@chakra-ui/react';

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

    return (<div className="main" id={slug}>
        <Heading size="3xl">{post![0].title}</Heading>
        <p>{post![0].description}</p>
        {blocks?.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
    </div>
    )
};
