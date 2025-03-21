import Link from "next/link";
import { getProduction } from "@/app/lib/actions";

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className="main">
      <h1>ASIANetwork Digital Resources</h1>
      {posts?.map((post) => (
        <div key={post.id}>
          <Link href={`/resources/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
        <p>{post.description}</p>
        </div>
       ))}
    </div>
  );
}
