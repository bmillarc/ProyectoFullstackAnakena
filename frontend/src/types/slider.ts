export interface SliderData {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
 }

export interface SliderProps {
  slides: SliderData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}