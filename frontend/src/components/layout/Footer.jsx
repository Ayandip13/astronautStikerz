import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
                ASTRONAUT <br /> STICKERZ
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Premium quality custom stickers, notebooks, and mousepads for creators and developers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/notebooks" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Notebooks
                </Link>
              </li>
              <li>
                <Link href="/category/mousepads" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Mousepads
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Subscribe</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
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
                className="min-w-0 flex-auto rounded-md border-0 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2 text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className="flex-none rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
