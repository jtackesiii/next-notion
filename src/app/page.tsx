export const revalidate = 60;

import { getProduction } from "@/app/lib/actions";
import { Heading } from "@chakra-ui/react";
import DataTable from "@/app/lib/DataTable";

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className="main">
      <Heading size="3xl">ASIANetwork Digital Resources</Heading>
      <p>This growing database includes resources for the research, teaching, and administration of Asian Studies. Search by title or select from a range of keywords to find relevant resources.</p>
      <p>If you have questions or suggestions about these offerings, please contact us!</p>
      <DataTable data={posts} />
    </div>
  );
}
