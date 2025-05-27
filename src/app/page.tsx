import { getProduction } from "@/app/lib/actions";
import { Heading } from "@chakra-ui/react";
import DataTable from "@/app/lib/DataTable";

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className="main">
      <Heading size="3xl">ASIANetwork Digital Resources</Heading>
      <DataTable data={posts} />
      {/* {posts?.map((post) => (
        <div key={post.id}>
          <Link href={`/resources/${post.slug}`}>
            <Heading size="2xl">{post.title}</Heading>
          </Link>
        <p>{post.description}</p>
        </div>
       ))} */}
    </div>
  );
}
