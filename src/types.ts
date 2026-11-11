export interface CardItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  imageUrl: string;
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
}

export type ActiveModule = 'carousel' | 'bottomElement';

export interface TouchState {
  startY: number;
  currentY: number;
  isDragging: boolean;
}
