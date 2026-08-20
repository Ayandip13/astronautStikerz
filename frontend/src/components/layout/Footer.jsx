'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CoffeeDoodle } from '@/components/ui/Doodles';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-bg-cream mt-auto border-t border-foreground/5 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-peach/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 transition-transform hover:-translate-y-1">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                Astronaut Stickerz ✦
              </span>
            </Link>
            <p className="text-base font-medium text-foreground/70">
              Stuff that makes your desk happier. Fun stickers, notebooks, and desk goodies.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/customize" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Customization
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 border-t border-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
            &copy; {new Date().getFullYear()} Astronaut Stickerz. Made with <CoffeeDoodle className="w-4 h-4 text-foreground/40" /> in Kolkata.
          </p>
        </div>
      </div>
    </footer>
  );
}
