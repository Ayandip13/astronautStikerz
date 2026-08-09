'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from '../search/SearchModal';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/products' },
    { name: 'Notebooks', href: '/category/notebooks' },
    { name: 'Mousepads', href: '/category/mousepads' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <AnnouncementBar />
        
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <div className="flex flex-1 items-center md:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 justify-center md:flex-none md:justify-start">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
                ASTRONAUT <br className="hidden sm:block" /> STICKERZ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                  isActive(item.href) ? 'text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <button 
              className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </button>
            
            <Link href="/admin" className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
              <span className="sr-only">Account</span>
              <User className="h-5 w-5" />
            </Link>
            
            <button className="group flex items-center text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">0</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Panel */}
            <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 py-6 shadow-xl dark:bg-zinc-900 sm:max-w-sm sm:ring-1 sm:ring-zinc-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-lg font-black tracking-tighter text-zinc-900 dark:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  ASTRONAUT STICKERZ
                </Link>
                <button
                  type="button"
                  className="-m-2 rounded-md p-2 text-zinc-400 hover:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-8 flow-root">
                <nav className="-my-6 divide-y divide-zinc-200 dark:divide-zinc-800">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link
                      href="/admin"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
