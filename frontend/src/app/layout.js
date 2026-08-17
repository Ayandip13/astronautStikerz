import { Outfit, Nunito } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fontNunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "Astronaut Stickerz",
  description: "Stuff that makes your desk happier. Fun stickers, notebooks, and desk goodies.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontNunito.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-pink-200 dark:selection:bg-pink-900">
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
