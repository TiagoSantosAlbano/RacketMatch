export interface Court {
  _id: string;
  name: string;
  location: string;
  surface: string;
  imageUrl?: string;
  isAvailable?: boolean;
  type?: string;
  price?: number;
  image?: string;
}
