import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import { getNavigation } from "@/app/lib/actions";
import Link from "next/link";
import { Image } from "@chakra-ui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASIANetwork Digital Resource Database",
  description: "This website is a database of resources related to researching, teaching, and learning Asian Studies. It is meant especially for faculty, students, and administrators at Liberal Arts Colleges.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = await getNavigation();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
        <header>
          <nav className="flex">
            <Link href="https://asianetwork.org"><Image className="header-img" src="/logo.png" alt="ASIANetwork logo" /></Link>
            {navItems?.map((item) => (
              <Link
                key={item.id}
                href={item.slug === "home" ? "/" : `/resources/${item.slug}`}
                className={`nav-item ${item.slug === "home" ? "home-link" : ""}`}
              >
                {item.title}
              </Link>
            ))}
            {/* <Link className="nav-item home-link" href="/"><b>Home</b></Link>
            <Link className="nav-item" href="/resources/about">About</Link>
            <Link className="nav-item" href="/resources/contact-us">Contact Us</Link> */}
          </nav>
        </header>
        <main>
          <div className="wrapper">
            {children}
          </div>
          </main>
        <footer>
          <div className="flex">
            <Image className="header-img" src="/logo.png" alt="ASIANetwork logo" />
            <Link className="nav-item home-link" href="/"><b>Home</b></Link>
            <Link className="nav-item" href="/resources/about">About</Link>
            <p>Contact Us</p>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} ASIANetwork</p>
          </footer>
          </Provider>
        </body>
    </html>
  );
}
