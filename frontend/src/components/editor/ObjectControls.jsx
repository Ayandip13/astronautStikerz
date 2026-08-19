import React, { useState } from 'react';
import { Layers, BringToFront, SendToBack, Bold, Italic, Type as TypeIcon } from 'lucide-react';
import { BlockPicker } from 'react-color'; // Note: Might need basic react-color import

export function ObjectControls({
  selectedObject,
  onUpdateObject,
  onBringForward,
  onSendBackward,
  onFit,
  onFill
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!selectedObject) return null;

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';

  const handleColorChange = (color) => {
    onUpdateObject({ fill: color.hex });
  };

  const toggleBold = () => {
    const isBold = selectedObject.fontWeight === 'bold';
    onUpdateObject({ fontWeight: isBold ? 'normal' : 'bold' });
  };

  const toggleItalic = () => {
    const isItalic = selectedObject.fontStyle === 'italic';
    onUpdateObject({ fontStyle: isItalic ? 'normal' : 'italic' });
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/95 backdrop-blur shadow-xl rounded-2xl p-2 border border-foreground/10 z-30 transition-all">
      
      {isText && (
        <>
          <div className="relative">
            <button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors"
            >
              <div 
                className="h-5 w-5 rounded-full border border-foreground/20 shadow-sm"
                style={{ backgroundColor: selectedObject.fill || '#000000' }}
              />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-12 left-0 z-50">
                <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                <div className="relative">
                  <BlockPicker 
                    color={selectedObject.fill || '#000000'}
                    onChangeComplete={handleColorChange}
                    triangle="hide"
                  />
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={toggleBold}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              selectedObject.fontWeight === 'bold' ? 'bg-brand-purple/20 text-brand-purple' : 'hover:bg-foreground/5'
            }`}
          >
            <Bold className="h-4 w-4" />
          </button>

          <button 
            onClick={toggleItalic}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              selectedObject.fontStyle === 'italic' ? 'bg-brand-purple/20 text-brand-purple' : 'hover:bg-foreground/5'
            }`}
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-foreground/10 mx-1"></div>
        </>
      )}

      {/* Layer Controls */}
      <button 
        onClick={onBringForward}
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors text-foreground/70"
        title="Bring Forward"
      >
        <BringToFront className="h-4 w-4" />
      </button>

      <button 
        onClick={onSendBackward}
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors text-foreground/70"
        title="Send Backward"
      >
        <SendToBack className="h-4 w-4" />
      </button>

      {!isText && (
        <>
          <div className="w-px h-6 bg-foreground/10 mx-1"></div>
          <button 
            onClick={onFit}
            className="flex h-8 px-2 text-xs font-bold items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors text-foreground/70"
            title="Fit to Print Area"
          >
            FIT
          </button>
          <button 
            onClick={onFill}
            className="flex h-8 px-2 text-xs font-bold items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors text-foreground/70"
            title="Fill Print Area"
          >
            FILL
          </button>
        </>
      )}

    </div>
  );
}
