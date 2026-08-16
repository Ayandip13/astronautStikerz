'use client';

import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { EditorialHero } from '@/components/home/EditorialHero';
import { EditorialProductGrid } from '@/components/home/EditorialProductGrid';
import { CustomizationStory } from '@/components/home/CustomizationStory';
import { CulturalStory } from '@/components/home/CulturalStory';
import { CategoryWorld } from '@/components/home/CategoryWorld';

export default function Home() {
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8, featured: true });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const featuredProducts = productsData?.products || [];
  const categories = categoriesData || [];

  return (
    <div className="flex flex-col w-full bg-background selection:bg-brand-peach/30">
      
      {/* 1. HERO: "The Astronaut Desk" / campaign composition */}
      <EditorialHero heroProducts={featuredProducts} />

      {/* 2. PRODUCT DISCOVERY */}
      {!productsLoading && <EditorialProductGrid products={featuredProducts} />}

      {/* 3. CATEGORY WORLD */}
      {!categoriesLoading && <CategoryWorld categories={categories} />}

      {/* 4. CUSTOMIZATION EXPERIENCE */}
      <CustomizationStory />

      {/* 5. CULTURAL / ART STORY */}
      <CulturalStory />

    </div>
  );
}
