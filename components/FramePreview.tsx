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

  const updateOffset = (dx: number, dy: number) => {
    setImageState(prev => ({
      ...prev,
      offset: { x: prev.offset.x + dx, y: prev.offset.y + dy }
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageState.src) return;
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    updateOffset(dx, dy);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageState.src) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setLastPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - lastPos.x;
    const dy = touch.clientY - lastPos.y;
    updateOffset(dx, dy);
    setLastPos({ x: touch.clientX, y: touch.clientY });
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimization for quality
    if (!ctx) return;

    const render = async () => {
      // High Quality Base Size (Standard Social Media Post Size)
      const size = 1080;
      canvas.width = size;
      canvas.height = size;

      // Fill background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Layer 1: User Image
      if (imageState.src) {
        const img = new Image();
        img.src = imageState.src;
        await new Promise((r) => (img.onload = r));

        ctx.save();
        // Adjust for internal canvas resolution relative to offset
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

        // Draw image with smoothing for high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      }

      // Layer 2: Frame Overlay
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDragging}
      className="w-full h-full touch-none cursor-move object-contain"
      style={{ imageRendering: 'auto' }}
    />
  );
};

export default FramePreview;