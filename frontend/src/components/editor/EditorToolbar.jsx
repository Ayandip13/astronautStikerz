import React, { useRef } from 'react';
import { Type, Image as ImageIcon, Undo2, Redo2, Trash2 } from 'lucide-react';

export function EditorToolbar({ 
  onAddText, 
  onUploadImage, 
  onUndo, 
  onRedo, 
  onDelete, 
  canUndo, 
  canRedo, 
  hasSelection 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  return (
    <div className="flex w-full items-center justify-center gap-4 bg-background p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] sm:flex-col sm:justify-start sm:w-20 sm:shadow-[4px_0_20px_-10px_rgba(0,0,0,0.1)] sm:h-full z-20">
      
      <button 
        onClick={onAddText}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-foreground/70 hover:bg-brand-purple/10 hover:text-brand-purple transition-colors"
      >
        <Type className="h-6 w-6" />
        <span className="text-[10px] font-bold">Text</span>
      </button>

      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-foreground/70 hover:bg-brand-yellow/20 hover:text-brand-purple transition-colors"
      >
        <ImageIcon className="h-6 w-6" />
        <span className="text-[10px] font-bold">Image</span>
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />

      <div className="w-px h-8 bg-foreground/10 sm:h-px sm:w-8 my-2 hidden sm:block"></div>

      <button 
        onClick={onUndo}
        disabled={!canUndo}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Undo2 className="h-5 w-5" />
      </button>

      <button 
        onClick={onRedo}
        disabled={!canRedo}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Redo2 className="h-5 w-5" />
      </button>

      {hasSelection && (
        <button 
          onClick={onDelete}
          className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-brand-coral hover:bg-brand-coral/10 transition-colors ml-auto sm:ml-0 sm:mt-auto"
        >
          <Trash2 className="h-6 w-6" />
          <span className="text-[10px] font-bold">Delete</span>
        </button>
      )}

    </div>
  );
}
