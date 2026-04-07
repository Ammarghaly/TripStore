import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Create a new order
   * POST /orders with full order payload
   */
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  /**
   * Two-step checkout flow:
   * 1. Create the order
   * 2. Clear the user's cart upon success
   * 
   * Uses concatMap to ensure strict sequential execution
   * @param order Order payload with userId, items, totalAmount, etc.
   * @param cartId Cart ID to clear after successful order creation
   */
  checkoutAndClearCart(order: Order, cartId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(
      // concatMap ensures cart clearing happens only after successful order creation
      concatMap(createdOrder => {
        // Clear cart by sending empty items array
        return this.http.patch<Cart>(`${this.apiUrl}/carts/${cartId}`, { items: [] }).pipe(
          // Return the created order after cart is cleared
          tap(() => console.log('Cart cleared successfully after order creation')),
          // Map back to the order (ignore cart response)
          concatMap(() => [createdOrder])
        );
      })
    );
  }

  /**
   * Get all orders for a specific user
   * GET /orders?userId={id}
   */
  getUserOrders(userId: string | number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders?userId=${userId}`);
  }

  /**
   * Get a single order by ID
   * GET /orders/{id}
   */
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
  }

  /**
   * Cancel an order (optional - depends on API)
   * PATCH /orders/{id}
   */
  cancelOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}`, { status: 'cancelled' });
  }
}
