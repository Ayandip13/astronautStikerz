export const CUSTOM_PRODUCTS = [
  {
    _id: '000000000000000000000001',
    name: 'Custom Notebook',
    slug: 'notebook',
    description: 'Design your own premium notebook. Perfect for journaling, sketching, or note-taking.',
    price: 499,
    stock: 9999,
    images: [{ url: '/notebook-mockup.png' }],
    customizable: true,
    customizationConfig: {
      enabled: true,
      canvasWidth: 800,
      canvasHeight: 1000,
      supportedSides: ['front', 'back'],
      printableArea: {
        x: 100,
        y: 100,
        width: 600,
        height: 800
      }
    }
  },
  {
    _id: '000000000000000000000002',
    name: 'Custom Mousepad',
    slug: 'mousepad',
    description: 'Create a personalized mousepad with your favorite artwork, photos, or logo.',
    price: 299,
    stock: 9999,
    images: [{ url: '/mousepad-mockup.png' }],
    customizable: true,
    customizationConfig: {
      enabled: true,
      canvasWidth: 1000,
      canvasHeight: 800,
      supportedSides: ['front'],
      printableArea: {
        x: 100,
        y: 100,
        width: 800,
        height: 600
      }
    }
  }
];

export const getCustomProductBySlug = (slug) => {
  return CUSTOM_PRODUCTS.find(p => p.slug === slug);
};
