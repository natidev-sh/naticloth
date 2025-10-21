export type Product = {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Accessories';
  price: number;
  image_urls: string[] | null;
  description: string | null;
  featured?: boolean | null;
};