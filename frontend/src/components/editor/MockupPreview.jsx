import React from 'react';

export function MockupPreview({ product, side = 'front', designUrl }) {
  if (!designUrl) {
    return (
      <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-50 rounded-3xl flex items-center justify-center">
        <p className="text-foreground/50">Preview not available</p>
      </div>
    );
  }

  const isNotebook = product.slug === 'notebook';
  const isMousepad = product.slug === 'mousepad';

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-zinc-100 border border-foreground/10 shadow-inner flex items-center justify-center p-8">
      
      {/* Pure CSS Mockup generation based on product type */}
      
      {isNotebook && (
        <div 
          className="relative shadow-2xl shadow-black/20 bg-white"
          style={{
            width: '60%', // 800x1000 aspect ratio ~ 0.8
            aspectRatio: '0.8',
            borderRadius: side === 'front' ? '0 12px 12px 0' : '12px 0 0 12px',
            borderLeft: side === 'front' ? '8px solid #ddd' : 'none',
            borderRight: side === 'back' ? '8px solid #ddd' : 'none',
          }}
        >
          {/* Notebook Binding / Crease */}
          <div 
            className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent ${side === 'front' ? 'left-0' : 'right-0 bg-gradient-to-l'}`}
          />
          
          <img 
            src={designUrl} 
            alt="Your Design" 
            className="absolute inset-0 w-full h-full object-fill opacity-95 mix-blend-multiply rounded-[inherit]"
          />
        </div>
      )}

      {isMousepad && (
        <div 
          className="relative shadow-xl shadow-black/30 bg-zinc-900 border-4 border-zinc-800"
          style={{
            width: '80%', // 1000x800 aspect ratio ~ 1.25
            aspectRatio: '1.25',
            borderRadius: '24px',
          }}
        >
          {/* Mousepad texture/sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[20px] pointer-events-none z-10" />
          
          <img 
            src={designUrl} 
            alt="Your Design" 
            className="absolute inset-0 w-full h-full object-fill rounded-[20px]"
          />
        </div>
      )}

    </div>
  );
}
