import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-test-card',
  templateUrl: './order-test-card.component.html',
  styleUrls: ['./order-test-card.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrderTestCardComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  cart: any = null;

  orderForm = {
    status: 'pending',
    shippingAddress: '123 Main St, City, State 12345'
  };

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserOrders();
    this.loadCart();
  }

  loadUserOrders(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.message = '✗ Please login first';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.orderService.getUserOrders(userId).subscribe(
      (data) => {
        this.orders = data;
        this.message = `✓ Loaded ${data.length} orders`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Failed to load orders: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      (data) => {
        this.cart = data;
      },
      (error) => {
        console.error('Failed to load cart');
      }
    );
  }

  createOrder(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.message = '✗ Please login first';
      this.messageType = 'error';
      return;
    }

    if (!this.cart || this.cart.details.length === 0) {
      this.message = '✗ Cart is empty';
      this.messageType = 'error';
      return;
    }

    // Calculate total
    const totalAmount = this.cart.details.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const orderPayload = {
      userId: +userId,
      orderDate: new Date().toISOString(),
      status: this.orderForm.status,
      totalAmount,
      shippingAddress: this.orderForm.shippingAddress,
      items: this.cart.details.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.loading = true;
    this.orderService.checkoutAndClearCart(orderPayload, this.cart.cart.id).subscribe(
      (data) => {
        this.message = `✓ Order created successfully! Order ID: ${data.id}`;
        this.messageType = 'success';
        this.loading = false;
        this.loadUserOrders();
        this.loadCart();
      },
      (error) => {
        this.message = `✗ Failed to create order: ${error.statusText || error.message}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCartTotal(): number {
    if (!this.cart || !this.cart.details) return 0;
    return this.cart.details.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
}
