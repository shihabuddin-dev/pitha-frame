import React, { useRef, useEffect, useState } from "react";
import { ImageState } from "../types";

interface FramePreviewProps {
  imageState: ImageState;
  frameImg: string;
  onCanvasUpdate: (canvas: HTMLCanvasElement) => void;
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
}

const FramePreview: React.FC<FramePreviewProps> = ({ 
  imageState, 
  frameImg, 
  onCanvasUpdate, 
  setImageState 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Handle Mouse Events for "Cropping" (Panning)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageState.src) return;
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    
    setImageState(prev => ({
      ...prev,
      offset: { x: prev.offset.x + dx, y: prev.offset.y + dy }
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = async () => {
      const size = 1080; // Standard High-Res Square
      canvas.width = size;
      canvas.height = size;

      // 1. Clear/Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // 2. Draw User Photo
      if (imageState.src) {
        const img = new Image();
        img.src = imageState.src;
        await new Promise((r) => (img.onload = r));

        ctx.save();
        // Move to center + user offset
        ctx.translate(size / 2 + imageState.offset.x, size / 2 + imageState.offset.y);
        ctx.rotate((imageState.rotation * Math.PI) / 180);
        ctx.scale(imageState.scale, imageState.scale);

        const imgRatio = img.width / img.height;
        let dw, dh;

        if (imgRatio > 1) {
          dh = size;
          dw = size * imgRatio;
        } else {
          dw = size;
          dh = size / imgRatio;
        }

        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      }

      // 3. Draw Frame Overlay (Last layer = Top layer)
      const frame = new Image();
      frame.src = frameImg;
      await new Promise((r) => (frame.onload = r));
      ctx.drawImage(frame, 0, 0, size, size);

      onCanvasUpdate(canvas);
    };

    render();
  }, [imageState, frameImg, onCanvasUpdate]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      className="w-full h-full touch-none cursor-move object-contain"
    />
  );
};

export default FramePreview;