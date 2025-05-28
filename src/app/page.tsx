export const revalidate = 60;

import { getProduction } from "@/app/lib/actions";
import { Heading } from "@chakra-ui/react";
import DataTable from "@/app/lib/DataTable";

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className="main">
      <Heading size="3xl">ASIANetwork Digital Resources</Heading>
      <DataTable data={posts} />
    </div>
  );
}
