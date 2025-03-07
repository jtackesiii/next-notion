import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASIANetwork Digital Resource Database",
  description: "This website is a database of resources related to researching, teaching, and learning Asian Studies. It is meant especially for faculty, students, and administrators at Liberal Arts Colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="flex">
            <Link href="https://asianetwork.org"><img className="header-img" src="/logo.png" alt="ASIANetwork logo" /></Link>
            <Link className="nav-item home-link" href="/"><b>Home</b></Link>
            <Link className="nav-item" href="/About">About</Link>
            <p>Contact Us</p>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <img className="footer-img" src="/logo.png" alt="ASIANetwork logo" />
          <div className="footer-nav flex">
            <Link className="nav-item home-link" href="/"><b>Home</b></Link>
            <p>Contact Us</p>
          </div>
          <p>&copy; {new Date().getFullYear()} ASIANetwork</p>
          </footer>
        </body>
    </html>
  );
}
