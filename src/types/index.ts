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

export type OrderItem = {
  id: string;
  quantity: number;
  price_at_order: number;
  product_details: {
    name: string;
    image_url: string | null;
  };
};

export type Order = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  order_items: OrderItem[];
};