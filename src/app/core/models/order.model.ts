import { CartItem } from './cart.model';

export interface Order {
  id?: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  items: CartItem[];
}
