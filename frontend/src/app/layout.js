import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Astronaut Stickerz",
  description: "Premium quality custom stickers, notebooks, and mousepads for creators and developers.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
        <QueryProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
