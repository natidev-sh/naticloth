export type Product = {
  id: number;
  name: string;
  category: 'Men' | 'Women' | 'Accessories';
  price: number;
  image: string;
  description: string;
  featured?: boolean;
};