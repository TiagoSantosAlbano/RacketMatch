export interface Court {
  _id: string;
  name: string;
  location: string;
  surface: string; // tipo de piso, como “sintético”, “terra batida” etc.
  imageUrl?: string;
  isAvailable?: boolean;
  type?: string;
  price?: number;
  image?: string;
}
