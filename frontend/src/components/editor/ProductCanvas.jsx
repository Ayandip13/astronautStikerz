import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { EditorToolbar } from './EditorToolbar';
import { ObjectControls } from './ObjectControls';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

export function ProductCanvas({ product, currentSide = 'front', onPreview, isLastStep = true }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHistoryAction, setIsHistoryAction] = useState(false);
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [currentDesignId, setCurrentDesignId] = useState(null);
  const [dpiWarning, setDpiWarning] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Store JSON state for each side to preserve when switching tabs
  const sidesStateRef = useRef({ front: null, back: null });

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

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth || 800,
      height: canvasHeight || 800,
      preserveObjectStacking: true,
      selection: true,
      backgroundColor: '#ffffff'
    });

    fabricCanvasRef.current = canvas;
    setFabricCanvas(canvas);

    // Setup Printable Area Overlay Mask
    if (printableArea) {
      const { x, y, width, height } = printableArea;
      
      const border = new fabric.Rect({
        left: x,
        top: y,
        width: width,
        height: height,
        fill: 'transparent',
        stroke: '#8B5CF6',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });

      canvas.add(border);
    }

    const initialState = JSON.stringify(canvas.toJSON(['id', 'excludeFromExport', 'assetUrl']));
    setHistory([initialState]);
    setHistoryIndex(0);
    sidesStateRef.current[currentSide] = initialState;

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [product]);

  // Handle Side Switching
  const previousSideRef = useRef(currentSide);
  useEffect(() => {
    if (!fabricCanvas) return;
    if (previousSideRef.current === currentSide) return;

    // Save current state before switching
    sidesStateRef.current[previousSideRef.current] = JSON.stringify(fabricCanvas.toJSON(['id', 'excludeFromExport', 'assetUrl']));

    // Load new state
    const newState = sidesStateRef.current[currentSide];
    if (newState) {
      fabricCanvas.loadFromJSON(newState, () => {
        fabricCanvas.renderAll();
      });
    } else {
      // Clear but keep printable area
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      if (product.customizationConfig?.printableArea) {
        const { x, y, width, height } = product.customizationConfig.printableArea;
        const border = new fabric.Rect({
          left: x, top: y, width, height,
          fill: 'transparent', stroke: '#8B5CF6', strokeWidth: 2, strokeDashArray: [5, 5],
          selectable: false, evented: false, excludeFromExport: true,
        });
        fabricCanvas.add(border);
      }
      fabricCanvas.renderAll();
    }
    
    previousSideRef.current = currentSide;
  }, [currentSide, fabricCanvas, product.customizationConfig]);


  // Event Listeners for History and Selection
  useEffect(() => {
    if (!fabricCanvas) return;

    const saveHistory = () => {
      if (isHistoryAction) return;
      const json = JSON.stringify(fabricCanvas.toJSON(['id', 'excludeFromExport', 'assetUrl']));
      
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(json);
        if (newHistory.length > 20) newHistory.shift();
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      // Update the current side state continuously
      sidesStateRef.current[currentSide] = json;
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
      fabricCanvas.off('object:modified');
      fabricCanvas.off('object:added');
      fabricCanvas.off('object:removed');
      fabricCanvas.off('selection:created');
      fabricCanvas.off('selection:updated');
      fabricCanvas.off('selection:cleared');
    };
  }, [fabricCanvas, history, historyIndex, isHistoryAction, currentSide]);

  // Canvas Scaling to fit screen
  useEffect(() => {
    if (!fabricCanvas || !containerRef.current) return;

    const resizeCanvas = () => {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const { canvasWidth, canvasHeight } = product.customizationConfig;
      const w = canvasWidth || 800;
      const h = canvasHeight || 800;
      
      const zoom = Math.min((containerWidth - 40) / w, (containerHeight - 40) / h);
      fabricCanvas.setZoom(zoom);
      
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
    if (targetX < 0 || targetX > canvasW) targetX = canvasW / 2;
    if (targetY < 0 || targetY > canvasH) targetY = canvasH / 2;
    return { x: targetX, y: targetY };
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const { printableArea, canvasWidth, canvasHeight } = product.customizationConfig;
    const { x, y } = getSafeCenter(printableArea, canvasWidth || 800, canvasHeight || 800);

    const text = new fabric.IText('Hello', {
      left: x, top: y, fontFamily: 'Inter, sans-serif', fill: '#111111', fontSize: 40, originX: 'center', originY: 'center',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const uploadImage = async (file) => {
    if (!fabricCanvas) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image smaller than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient.post('/designs', formData);
      const imageUrl = res.imageUrl;
      
      if (!currentDesignId) setCurrentDesignId(res._id);
      
      fabric.Image.fromURL(getImageUrl(imageUrl), (img) => {
        if (!img) {
          alert(`Failed to load the uploaded image from ${imageUrl}.`);
          setIsUploading(false);
          return;
        }

        const { printableArea, canvasWidth, canvasHeight } = product.customizationConfig;
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
          left: x, top: y, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale,
          assetUrl: imageUrl 
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        setIsUploading(false);
      }, { crossOrigin: 'anonymous' });
      
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Please try again.");
      setIsUploading(false);
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

  const handleFit = () => {
    if (!fabricCanvas || !selectedObject || selectedObject.type === 'i-text' || selectedObject.type === 'text') return;
    const { canvasWidth, canvasHeight, printableArea } = product.customizationConfig;
    const w = canvasWidth || 800;
    const h = canvasHeight || 800;
    const pArea = printableArea || { x: 0, y: 0, width: w, height: h };
    const scale = Math.min(pArea.width / selectedObject.width, pArea.height / selectedObject.height);
    
    selectedObject.set({
      scaleX: scale,
      scaleY: scale,
      left: pArea.x + pArea.width / 2,
      top: pArea.y + pArea.height / 2,
    });
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified');
  };

  const handleFill = () => {
    if (!fabricCanvas || !selectedObject || selectedObject.type === 'i-text' || selectedObject.type === 'text') return;
    const { canvasWidth, canvasHeight, printableArea } = product.customizationConfig;
    const w = canvasWidth || 800;
    const h = canvasHeight || 800;
    const pArea = printableArea || { x: 0, y: 0, width: w, height: h };
    const scale = Math.max(pArea.width / selectedObject.width, pArea.height / selectedObject.height);
    
    selectedObject.set({
      scaleX: scale,
      scaleY: scale,
      left: pArea.x + pArea.width / 2,
      top: pArea.y + pArea.height / 2,
    });
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified');
  };

  const handlePreview = async () => {
    if (!fabricCanvas) return;
    setSaving(true);
    
    try {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();

      const zoom = fabricCanvas.getZoom();
      const previewImageBase64 = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        multiplier: 1 / zoom,
      });
      
      const previewRes = await apiClient.post('/designs/preview', {
        previewImageBase64
      });

      let transform = { x: 0, y: 0, scaleX: 1, scaleY: 1, angle: 0 };
      const objects = fabricCanvas.getObjects();
      const mainImage = objects.find(obj => !obj.excludeFromExport && obj.type === 'image');
      if (mainImage) {
        transform = {
          x: mainImage.left,
          y: mainImage.top,
          scaleX: mainImage.scaleX,
          scaleY: mainImage.scaleY,
          angle: mainImage.angle
        };
      }

      onPreview({
        designId: currentDesignId || 'custom-text-only',
        previewImage: previewRes.previewUrl,
        customization: {
          canvasWidth: product.customizationConfig.canvasWidth,
          canvasHeight: product.customizationConfig.canvasHeight,
          designPosition: { x: transform.x, y: transform.y },
          designScale: { x: transform.scaleX, y: transform.scaleY },
          designRotation: transform.angle,
        }
      });
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to generate preview. Please try again or check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col sm:flex-row">
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

      <div ref={containerRef} className="relative flex-1 bg-background flex items-center justify-center p-4 overflow-hidden">
        {dpiWarning && (
          <div className="absolute top-4 right-4 z-40 rounded-lg bg-brand-yellow/20 px-4 py-2 text-sm font-bold text-foreground shadow-sm border border-brand-yellow/50">
            {dpiWarning}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-brand-purple/20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
              <p className="font-bold text-sm text-foreground">Uploading Image...</p>
            </div>
          </div>
        )}

        <ObjectControls 
          selectedObject={selectedObject}
          onUpdateObject={updateSelected}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onFit={handleFit}
          onFill={handleFill}
        />

        <div className="relative shadow-xl ring-2 ring-foreground/10 bg-white rounded-md overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-30">
        <Button 
          size="lg" 
          variant="primary" 
          onClick={handlePreview} 
          disabled={saving}
          className="shadow-2xl flex items-center gap-2 px-8 py-6 text-lg rounded-2xl"
        >
          {saving ? (
            <><Loader2 className="h-6 w-6 animate-spin" /> Processing...</>
          ) : (
            isLastStep ? "Review Design" : "Next: Back Design"
          )}
        </Button>
      </div>
    </div>
  );
}
