export interface GalleryImageItem {
  id: string;
  url: string;
  title: string;
  category?: string;
  subtitle?: string;
  size: 'large' | 'tall' | 'square' | 'small';
}

export interface CardItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  imageUrl: string;
  mediaType?: 'image' | 'video' | 'gif';
  videoUrl?: string;
  accentColor: string;
  gradient: string;
  glowColor: string;
  badgeBg: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  longDescription: string;
  tags: string[];
  hasDownload?: boolean; // Habilita o deshabilita la estación de descargas
  gallery?: GalleryImageItem[]; // Galería de imágenes estilo Bento Tiles de Windows
  version?: string;
  downloadUrl?: string;
  fileSize?: string;
  releaseDate?: string;
}

export type ActiveModule = 'carousel' | 'bottomElement';

export interface TouchState {
  startY: number;
  currentY: number;
  isDragging: boolean;
}
