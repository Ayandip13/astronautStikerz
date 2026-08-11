'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-background mt-auto border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 transition-transform hover:-translate-y-1">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                Astronaut Stickerz ✨
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
                <Link href="/category/notebooks" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Notebooks
                </Link>
              </li>
              <li>
                <Link href="/category/mousepads" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Mousepads
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
                <Link href="/shipping" className="text-base font-medium text-foreground/70 hover:text-brand-purple transition-colors">
                  Shipping & Returns
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
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Subscribe</h3>
            <p className="text-base font-medium text-foreground/70 mb-4">
              Get the latest updates on new products and upcoming sales.
            </p>
            <form className="flex max-w-md gap-x-2">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-full border-0 bg-background px-4 py-2 text-foreground shadow-sm ring-1 ring-inset ring-foreground/20 focus:ring-2 focus:ring-inset focus:ring-brand-purple sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className="flex-none rounded-full bg-brand-purple px-4 py-2 text-sm font-bold text-white shadow-sm hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple active:scale-95 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="mt-12 border-t border-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm font-medium text-foreground/60">
            &copy; {new Date().getFullYear()} Astronaut Stickerz. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
