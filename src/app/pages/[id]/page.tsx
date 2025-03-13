import { Fragment } from "react";
import { getPageById, getBlocks } from "@/app/lib/actions";
import { renderBlock } from "@/app/lib/renderer";

// export async function generateStaticParams() {
//   const database = await getPageById();
//   return database?.map((page) => {
//     const slug = page.properties.slug?.formula?.string;
//     return ({ id: page.id, slug });
//   });
// }

export default async function PostPage ({
    params,
}: {
    params: Promise<{id: string}>;
}) {
    const postId = (await params).id;
    const post = await getPageById(postId);
    const blocks = await getBlocks(postId);
    return <div className="main">
        <h2>{post?.title}</h2>
        <p>{post?.description}</p>
        {blocks?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
    </div>
};
