
export interface Frame {
  id: string;
  name: string;
  url: string; // Base64 or URL
  color: string;
}

export interface ImageState {
  src: string | null;
  name: string;
  caption: string;
  frameId: string;
  scale: number;
  rotation: number;
}
