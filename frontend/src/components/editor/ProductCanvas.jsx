import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { EditorToolbar } from './EditorToolbar';
import { ObjectControls } from './ObjectControls';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

export function ProductCanvas({ product, initialDesignId, onSave }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHistoryAction, setIsHistoryAction] = useState(false);
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Track the primary design ID associated with this session
  const [currentDesignId, setCurrentDesignId] = useState(initialDesignId || null);
  const [dpiWarning, setDpiWarning] = useState(null);

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';
    let url = typeof image === 'string' ? image : image.url;
    if (!url) return '/placeholder.jpg';
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (url.startsWith('http://localhost:5000/uploads')) {
        url = url.replace('http://localhost:5000', baseUrl);
    } else if (url.startsWith('/uploads')) {
        url = `${baseUrl}${url}`;
    }
    return url;
  };

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !product.customizationConfig) return;

    const { canvasWidth, canvasHeight, printableArea } = product.customizationConfig;
    
    let isDisposed = false;

    // Create Fabric instance
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth || 800,
      height: canvasHeight || 800,
      preserveObjectStacking: true,
      selection: true,
    });

    // Set background product image
    const mainImage = getImageUrl(product.images?.[0]);
    fabric.Image.fromURL(mainImage, (img) => {
      if (isDisposed) return;
      // Scale to fit canvas
      const scale = Math.min(
        (canvasWidth || 800) / img.width,
        (canvasHeight || 800) / img.height
      );
      img.set({
        originX: 'center',
        originY: 'center',
        left: (canvasWidth || 800) / 2,
        top: (canvasHeight || 800) / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false, // Don't interact with background
      });
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    }, { crossOrigin: 'anonymous' });

    // Setup Printable Area Overlay Mask
    if (printableArea) {
      const { x, y, width, height } = printableArea;
      
      // We create a grey overlay with a transparent hole
      const mask = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvasWidth || 800,
        height: canvasHeight || 800,
        fill: 'rgba(255, 255, 255, 0.5)',
        selectable: false,
        evented: false,
        excludeFromExport: true, // Don't include in final JSON
      });

      // Fabric v5 has clipPath for the canvas, we can use a clip path to restrict rendering if we want,
      // but showing boundaries is better. Let's just draw a subtle dashed border around the printable area
      // that is excluded from export.
      const border = new fabric.Rect({
        left: x,
        top: y,
        width: width,
        height: height,
        fill: 'transparent',
        stroke: '#8B5CF6', // brand-purple
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });

      canvas.add(border);
    }

    setFabricCanvas(canvas);

    // Initial history state
    const initialState = JSON.stringify(canvas.toJSON(['id', 'excludeFromExport']));
    setHistory([initialState]);
    setHistoryIndex(0);

    return () => {
      isDisposed = true;
      canvas.dispose();
    };
  }, [product]);

  // Event Listeners for History and Selection
  useEffect(() => {
    if (!fabricCanvas) return;

    const saveHistory = () => {
      if (isHistoryAction) return;
      const json = JSON.stringify(fabricCanvas.toJSON(['id', 'excludeFromExport']));
      
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(json);
        // Limit history to 20 states
        if (newHistory.length > 20) newHistory.shift();
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    };

    const handleSelection = (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
    };

    fabricCanvas.on('object:modified', saveHistory);
    fabricCanvas.on('object:added', (e) => {
      if (!e.target.excludeFromExport) saveHistory();
    });
    fabricCanvas.on('object:removed', (e) => {
      if (!e.target.excludeFromExport) saveHistory();
    });
    
    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));

    return () => {
      fabricCanvas.off('object:modified', saveHistory);
      fabricCanvas.off('object:added');
      fabricCanvas.off('object:removed');
      fabricCanvas.off('selection:created');
      fabricCanvas.off('selection:updated');
      fabricCanvas.off('selection:cleared');
    };
  }, [fabricCanvas, history, historyIndex, isHistoryAction]);

  // Canvas Scaling to fit screen
  useEffect(() => {
    if (!fabricCanvas || !containerRef.current) return;

    const resizeCanvas = () => {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const { canvasWidth, canvasHeight } = product.customizationConfig;
      const w = canvasWidth || 800;
      const h = canvasHeight || 800;
      
      // Calculate zoom to fit
      const zoom = Math.min((containerWidth - 40) / w, (containerHeight - 40) / h);
      fabricCanvas.setZoom(zoom);
      
      // Center the canvas inside the container visually using CSS, or update canvas dimensions
      fabricCanvas.setDimensions({
        width: w * zoom,
        height: h * zoom
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [fabricCanvas, product.customizationConfig]);

  const getSafeCenter = (printableArea, canvasW, canvasH) => {
    let targetX = printableArea ? printableArea.x + printableArea.width / 2 : canvasW / 2;
    let targetY = printableArea ? printableArea.y + printableArea.height / 2 : canvasH / 2;
    
    // Sanity check to ensure it's visible on the canvas
    if (targetX < 0 || targetX > canvasW) targetX = canvasW / 2;
    if (targetY < 0 || targetY > canvasH) targetY = canvasH / 2;
    
    return { x: targetX, y: targetY };
  };

  // Tools
  const addText = () => {
    if (!fabricCanvas) return;
    const { printableArea, canvasWidth, canvasHeight } = product.customizationConfig;
    const w = canvasWidth || 800;
    const h = canvasHeight || 800;
    
    const { x, y } = getSafeCenter(printableArea, w, h);

    const text = new fabric.IText('Hello', {
      left: x,
      top: y,
      fontFamily: 'Inter, sans-serif',
      fill: '#111111',
      fontSize: 40,
      originX: 'center',
      originY: 'center',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  // Load initial design if provided
  useEffect(() => {
    if (fabricCanvas && initialDesignId) {
      const loadInitialDesign = async () => {
        try {
          const res = await apiClient.get(`/designs/${initialDesignId}`);
          if (res.imageUrl) {
            fabric.Image.fromURL(getImageUrl(res.imageUrl), (img) => {
              if (!img) return;
              const { canvasWidth, canvasHeight, printableArea } = product.customizationConfig;
              const w = canvasWidth || 800;
              const h = canvasHeight || 800;
              
              const { x, y } = getSafeCenter(printableArea, w, h);
              
              let scale = 1;
              const maxWidth = printableArea ? printableArea.width : w;
              const maxHeight = printableArea ? printableArea.height : h;
              
              if (img.width > maxWidth || img.height > maxHeight) {
                scale = Math.min(maxWidth / img.width, maxHeight / img.height) * 0.8;
              }

              img.set({
                left: x,
                top: y,
                originX: 'center',
                originY: 'center',
                scaleX: scale,
                scaleY: scale,
                assetUrl: res.imageUrl
              });

              fabricCanvas.add(img);
              fabricCanvas.setActiveObject(img);
              fabricCanvas.renderAll();
            }, { crossOrigin: 'anonymous' });
          }
        } catch (error) {
          console.error('Failed to load initial design:', error);
        }
      };
      loadInitialDesign();
    }
  }, [fabricCanvas, initialDesignId, product.customizationConfig]);

  const uploadImage = async (file) => {
    if (!fabricCanvas) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      // 1. Upload to Cloudinary via backend. We use the main POST /designs to create a Design asset.
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient.post('/designs', formData);
      
      const imageUrl = res.imageUrl;
      
      // If no design ID is tracked yet, track this one
      if (!currentDesignId) {
        setCurrentDesignId(res._id);
      }
      
      // 2. Add to Canvas
      fabric.Image.fromURL(getImageUrl(imageUrl), (img) => {
        if (!img) {
          alert(`Failed to load the uploaded image from ${imageUrl}.`);
          return;
        }

        // DPI / Quality check approximation
        // If image is very small relative to printable area
        const { printableArea } = product.customizationConfig;
        if (printableArea && (img.width < printableArea.width / 4)) {
          setDpiWarning("🟡 Uploaded image is small and may appear blurry when printed.");
          setTimeout(() => setDpiWarning(null), 5000);
        }

        const { canvasWidth, canvasHeight } = product.customizationConfig;
        const w = canvasWidth || 800;
        const h = canvasHeight || 800;
        
        const { x, y } = getSafeCenter(printableArea, w, h);
        
        // Scale down if too big
        let scale = 1;
        const maxWidth = printableArea ? printableArea.width : w;
        const maxHeight = printableArea ? printableArea.height : h;
        
        if (img.width > maxWidth || img.height > maxHeight) {
          scale = Math.min(maxWidth / img.width, maxHeight / img.height) * 0.8;
        }

        img.set({
          left: x,
          top: y,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          // Store Cloudinary URL in a custom property so it exports in JSON
          assetUrl: imageUrl 
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
      }, { crossOrigin: 'anonymous' });
      
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setIsHistoryAction(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      fabricCanvas.loadFromJSON(history[newIndex], () => {
        fabricCanvas.renderAll();
        setIsHistoryAction(false);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setIsHistoryAction(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      fabricCanvas.loadFromJSON(history[newIndex], () => {
        fabricCanvas.renderAll();
        setIsHistoryAction(false);
      });
    }
  };

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.remove(selectedObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  const updateSelected = (updates) => {
    if (!fabricCanvas || !selectedObject) return;
    selectedObject.set(updates);
    fabricCanvas.renderAll();
    // Fire modified event for history
    fabricCanvas.fire('object:modified');
  };

  const bringForward = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.bringForward(selectedObject);
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified');
  };

  const sendBackward = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.sendBackwards(selectedObject);
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified');
  };

  const handleSave = async () => {
    if (!fabricCanvas) return;
    setSaving(true);
    
    try {
      // De-select objects before generating preview
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();

      // Ensure export multiplier captures original 1:1 scale, ignoring current zoom
      const zoom = fabricCanvas.getZoom();
      
      const previewImageBase64 = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        multiplier: 1 / zoom, // Export at original resolution
      });
      
      // We don't save designState to backend anymore. We just upload the preview.
      const previewRes = await apiClient.post('/designs/preview', {
        previewImageBase64
      });

      // Pass ID and preview URL back to parent
      // If the user didn't upload any images (just added text), they won't have a currentDesignId.
      // In a strict flow, they should have one. If null, we could pass a fallback string.
      onSave(currentDesignId || 'custom-text-only', previewRes.previewUrl);
      
    } catch (err) {
      console.error(err);
      if (err.message) {
         alert(err.message);
      } else {
         alert("Failed to save design. Please ensure you are logged in.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col sm:flex-row">
      {/* Sidebar Toolbar */}
      <EditorToolbar 
        onAddText={addText}
        onUploadImage={uploadImage}
        onUndo={undo}
        onRedo={redo}
        onDelete={deleteSelected}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasSelection={!!selectedObject}
      />

      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="relative flex-1 bg-background flex items-center justify-center p-4 overflow-hidden"
      >
        {dpiWarning && (
          <div className="absolute top-4 right-4 z-40 rounded-lg bg-brand-yellow/20 px-4 py-2 text-sm font-bold text-foreground shadow-sm border border-brand-yellow/50">
            {dpiWarning}
          </div>
        )}

        <ObjectControls 
          selectedObject={selectedObject}
          onUpdateObject={updateSelected}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
        />

        {/* The wrapper div helps centering the zoomed canvas */}
        <div className="relative shadow-xl ring-2 ring-foreground/10 bg-white rounded-md overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Bottom Save Bar (Mobile) / Absolute (Desktop) */}
      <div className="absolute bottom-6 right-6 z-30">
        <Button 
          size="lg" 
          variant="primary" 
          onClick={handleSave} 
          disabled={saving}
          className="shadow-2xl flex items-center gap-2 px-8 py-6 text-lg rounded-2xl"
        >
          {saving ? (
            <><Loader2 className="h-6 w-6 animate-spin" /> Saving...</>
          ) : (
            <><ShoppingCart className="h-6 w-6" /> Add to Cart</>
          )}
        </Button>
      </div>
    </div>
  );
}
