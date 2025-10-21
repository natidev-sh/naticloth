export type Product = {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Accessories' | 'Footwear' | 'Outerwear' | string;
  price: number;
  image_urls: string[] | null;
  description: string | null;
  featured?: boolean | null;
};

export type Category = {
  id: string;
  name: string;
  image_url?: string | null;
};

export type UserForAdmin = {
  id: string;
  email?: string;
  role?: 'user' | 'admin' | string | null;
};