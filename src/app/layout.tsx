import "./globals.css"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carbon Emission Dashboard",
  description: "A responsive GHG dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-primary text-white py-4 shadow">
          <div className="max-w-[1200px] mx-auto px-4 my-4">
            <h1 className="text-xl font-semibold">Carbon Dashboard</h1>
            <nav className="flex gap-4">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/posts" className="hover:underline">Posts</a>
            </nav>
          </div>
        </header>
        <main className="max-w-container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
