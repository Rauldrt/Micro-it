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
