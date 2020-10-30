export interface OrphanageView{
  id: number;
  name: string;
  about: string;
  images: {
    id: number;
    url: string;
  }[];
  instructions: string;
  latitude: number;
  longitude: number;
  open_on_weekends: boolean;
  opening_hours: string;
}