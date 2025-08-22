export const revalidate = 60;

import { getProduction } from "@/app/lib/actions";
import { getHome } from "@/app/lib/actions";
import { renderBlock } from "./lib/renderer";
import { Heading } from "@chakra-ui/react";
import DataTable from "@/app/lib/DataTable";

export default async function Home() {
  const posts = await getProduction();
  const blocks = await getHome();
  return (
    <div className="main">
      {/* <Heading size="3xl">ASIANetwork Digital Resources</Heading>
      <p>This growing database includes resources for the research, teaching, and administration of Asian Studies. Search by title or select from a range of keywords to find relevant resources.</p>
      <p>If you have questions or suggestions about these offerings, please contact us!</p> */}
        {blocks ? (
          blocks.map((block: any) => (
            <section key={block.id}>
              {renderBlock(block)}
            </section>
          ))
        ) : (
          <p>No content found</p>
        )}
      <DataTable data={posts} />
    </div>
  );
}
