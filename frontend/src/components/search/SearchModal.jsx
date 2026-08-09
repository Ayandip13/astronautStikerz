'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useProducts } from '@/lib/api/hooks/useProducts';
import Link from 'next/link';

export function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useProducts({
    keyword: debouncedSearch,
    limit: 5,
  });

  const products = data?.products || [];

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else if (!isOpen) {
      setSearchTerm('');
      setDebouncedSearch('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 top-0 z-[101] bg-white p-4 shadow-xl dark:bg-zinc-900 sm:p-6 transition-transform transform translate-y-0">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              className="h-16 w-full rounded-2xl border-0 bg-zinc-100 pl-14 pr-12 text-lg text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-black dark:bg-black dark:text-white dark:focus:ring-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          {/* Quick Results */}
          {debouncedSearch && (
            <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-black">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-zinc-500">Searching...</div>
              ) : products.length > 0 ? (
                <ul className="flex flex-col">
                  {products.map((product) => (
                    <li key={product._id}>
                      <Link 
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-lg p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                           <img 
                             src={product.images?.[0]?.url || '/placeholder.jpg'} 
                             alt={product.name}
                             className="h-full w-full object-cover"
                           />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{product.name}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">₹{product.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button 
                      onClick={handleSubmit}
                      className="w-full mt-2 rounded-lg bg-zinc-100 p-3 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-colors"
                    >
                      View all results for "{debouncedSearch}"
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-zinc-500">
                  No products found for "{debouncedSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
