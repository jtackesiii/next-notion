import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { getProduction } from "@/app/lib/actions";

export default async function Home() {
  const posts = await getProduction();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div><h1>Hello World</h1></div>
        {posts?.map((post) => (
          <Link key={post.id} href={`/pages/${post.id}`}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </main>
      <footer className={styles.footer}>

      </footer>
    </div>
  );
}
