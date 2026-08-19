'use client';

import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ShopByCategory } from '@/components/home/ShopByCategory';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CustomizationBanner } from '@/components/home/CustomizationBanner';
import { NewArrivals } from '@/components/home/NewArrivals';
import { ThemeDiscovery } from '@/components/home/ThemeDiscovery';
import { CulturalStory } from '@/components/home/CulturalStory';
import { TrustStrip } from '@/components/home/TrustStrip';

export default function Home() {
  const { data: featuredData, isLoading: loadingFeatured } = useProducts({ limit: 8, featured: true });
  const { data: newArrivalsData, isLoading: loadingNewArrivals } = useProducts({ limit: 4, sort: 'newest' });
  const { data: categoriesData, isLoading: loadingCategories } = useCategories();

  const featuredProducts = featuredData?.products || [];
  const newArrivals = newArrivalsData?.products || [];
  const categories = categoriesData || [];

  return (
    <div className="flex flex-col w-full bg-background selection:bg-brand-peach/30">
      
      {/* 1. HERO CAMPAIGN BANNER */}
      <HeroBanner />
      
      {/* 8. TRUST STRIP */}
      <TrustStrip />

      {/* 2. SHOP BY CATEGORY */}
      <ShopByCategory categories={categories} isLoading={loadingCategories} />

      {/* 3. FEATURED PRODUCTS */}
      <FeaturedProducts products={featuredProducts} isLoading={loadingFeatured} />

      {/* 4. CUSTOMIZATION BANNER */}
      <CustomizationBanner />

      {/* 5. NEW ARRIVALS */}
      <NewArrivals products={newArrivals} isLoading={loadingNewArrivals} />

      {/* 6. THEME DISCOVERY */}
      <ThemeDiscovery categories={categories} isLoading={loadingCategories} />

      {/* 7. CULTURAL / ART STORY */}
      <CulturalStory />
    </div>
  );
}
