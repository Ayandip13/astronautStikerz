'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from '../search/SearchModal';
import { CartDrawer } from '../cart/CartDrawer';
import { useCartStore } from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { useCategories } from '@/lib/api/hooks/useCategories';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isCartOpen, openCart, closeCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { user, logout } = useAuthStore();
  const { data: categoriesData } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const categories = categoriesData || [];

  const baseNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Customization ✨', href: '/customize' },
    { name: 'Shop All', href: '/products' },
  ];

  const categoryNavigation = categories.map(cat => ({
    name: cat.name,
    href: `/category/${cat.slug}`,
  }));

  const navigation = [...baseNavigation, ...categoryNavigation];

  const isActive = (path) => pathname === path;

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <AnnouncementBar />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <div className="flex flex-1 items-center md:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-foreground/50 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 justify-center md:flex-none md:justify-start">
            <Link href="/" className="flex flex-col items-start justify-center leading-none transition-transform hover:-translate-y-0.5 active:scale-95 py-1">
              <span 
                className="font-black text-[28px] md:text-[32px] uppercase text-[#E4B84A] italic" 
                style={{ 
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  WebkitTextStroke: '1.5px #321E25',
                  textShadow: '3px 3px 0px #321E25',
                  letterSpacing: '0.02em'
                }}
              >
                ASTRONAUT
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-5 lg:gap-8 mx-auto px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:text-brand-purple ${isActive(item.href) ? 'text-brand-purple' : 'text-foreground/70'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex flex-1 items-center justify-end gap-5 md:flex-none">
            <button
              className="text-foreground/70 transition-transform hover:scale-110 hover:text-brand-purple"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : '/account/orders'} className="text-foreground/70 transition-transform hover:scale-110 hover:text-brand-purple">
                <span className="sr-only">Account</span>
                <User className="h-5 w-5 text-brand-purple" />
              </Link>
            ) : (
              <Link href="/login" className="text-foreground/70 transition-transform hover:scale-110 hover:text-brand-purple">
                <span className="sr-only">Account</span>
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              className="group flex items-center text-foreground/70 transition-transform hover:scale-110 hover:text-brand-purple"
              onClick={openCart}
            >
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="ml-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-coral px-1 text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
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
            <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background px-6 py-6 shadow-xl sm:max-w-sm sm:ring-1 sm:ring-foreground/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="font-display text-2xl font-bold tracking-tight text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                  Astronaut Stickerz ✦
                </Link>
                <button
                  type="button"
                  className="-m-2 rounded-md p-2 text-foreground/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8 flow-root">
                <nav className="-my-6 divide-y divide-foreground/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-bold text-foreground hover:bg-foreground/5 hover:text-brand-purple"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 space-y-2">
                    {user ? (
                      <>
                        <Link
                          href={user.role === 'admin' ? '/admin' : '/account/orders'}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-bold text-foreground hover:bg-foreground/5 hover:text-brand-purple"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-bold text-brand-coral hover:bg-foreground/5"
                        >
                          Log out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-bold text-foreground hover:bg-foreground/5 hover:text-brand-purple"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
