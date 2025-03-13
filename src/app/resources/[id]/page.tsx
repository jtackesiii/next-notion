import { Fragment } from "react";
import { getPageById, getBlocks } from "@/app/lib/actions";
import { renderBlock } from "@/app/lib/renderer";


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
