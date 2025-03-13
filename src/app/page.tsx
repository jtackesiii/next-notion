import Link from "next/link";
import { getProduction } from "@/app/lib/actions";
import { columns } from "./lib/columns"
import { DataTable } from "./lib/data-table"

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className="main">
      <h1>ASIANetwork Digital Resources</h1>
      {/* <div className="container mx-auto py-10">
        <DataTable columns={columns} data={posts} />
      </div> */}
      {posts?.map((post) => (
        <div key={post.id}>
          <Link href={`/resources/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
        <p>{post.description}</p>
        </div>
       ))}
    </div>
  );
}
