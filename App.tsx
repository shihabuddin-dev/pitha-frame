import React, { useState, useCallback, useRef } from "react";
import FramePreview from "./components/FramePreview";
import { ImageState } from "./types";

// Import your assets
import frame1 from "./assets/frame1.png";
import frame2 from "./assets/frame2.png";
import frame3 from "./assets/frame3.png";
import frame4 from "./assets/frame4.png";

const frames = [
  { id: "f1", src: frame1, label: "Classic" },
  { id: "f2", src: frame2, label: "Elegant" },
  { id: "f3", src: frame3, label: "Festive" },
  { id: "f4", src: frame4, label: "Minimal" },
];

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    src: null,
    scale: 1,
    rotation: 0,
    offset: { x: 0, y: 0 }
  });

  const [selectedFrame, setSelectedFrame] = useState(frames[0].src);
  const [lastCanvas, setLastCanvas] = useState<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageState({
        src: event.target?.result as string,
        scale: 1,
        rotation: 0,
        offset: { x: 0, y: 0 }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!lastCanvas) return;
    const link = document.createElement("a");
    link.download = `pitha-frame-${Date.now()}.png`;
    link.href = lastCanvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const onCanvasUpdate = useCallback((canvas: HTMLCanvasElement) => {
    setLastCanvas(canvas);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-indigo-600">Pitha Frame</h1>
        <button
          onClick={handleDownload}
          disabled={!imageState.src}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-30"
        >
          Download
        </button>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-square bg-white rounded-3xl shadow-xl overflow-hidden relative border-4 border-white">
            <FramePreview
              imageState={imageState}
              frameImg={selectedFrame}
              onCanvasUpdate={onCanvasUpdate}
              setImageState={setImageState}
            />
            {!imageState.src && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white px-6 py-3 rounded-xl shadow-md font-bold text-indigo-600"
                >
                  + Upload Photo
                </button>
              </div>
            )}
          </div>

          {/* Zoom/Rotate Controls */}
          {imageState.src && (
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400">ZOOM</span>
              <input
                type="range" min="0.5" max="3" step="0.01"
                value={imageState.scale}
                onChange={(e) => setImageState(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                className="flex-grow"
              />
              <button
                onClick={() => setImageState(p => ({ ...p, rotation: p.rotation + 90 }))}
                className="p-2 bg-slate-100 rounded-lg"
              >
                <span className="hidden md:inline">Rotate</span> ↻
              </button>
            </div>
          )}
        </div>

        {/* Right: Frame Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4">Choose Frame Style</h3>
            <div className="grid grid-cols-2 gap-4">
              {frames.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFrame(f.src)}
                  className={`relative p-2 rounded-xl border-2 transition-all ${selectedFrame === f.src ? "border-indigo-500 bg-indigo-50" : "border-slate-100"
                    }`}
                >
                  <img src={f.src} alt={f.label} className="w-full aspect-square object-contain" />
                  <span className="text-[10px] font-bold uppercase mt-1 block">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <p className="text-center my-2 font-semibold">Developed By <a className="text-blue-800" href="https://shihab-dev.web.app/" target="_blank">Shihab Uddin</a></p>
    </div>
  );
};

export default App;