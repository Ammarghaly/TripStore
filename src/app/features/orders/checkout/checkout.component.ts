import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItemDetail } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cartId = 0;
  cartDetails: CartItemDetail[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;
  
  checkoutData = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiry: '',
    cvc: ''
  };

  isProcessing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartId = res.cart.id;
        this.cartDetails = res.details;
        this.calculateTotals();
        
        if (this.cartDetails.length === 0) {
          // Empty cart handle
        }
      },
      error: (err: any) => console.error('Failed to load cart', err)
    });
  }

  calculateTotals() {
    this.subtotal = this.cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = this.subtotal * 0.12; // Using 12% as per HTML requirement
    this.total = this.subtotal + this.tax;
  }

  onConfirm() {
    if (this.cartDetails.length === 0) return;
    
    this.isProcessing = true;
    const items: CartItem[] = this.cartDetails.map(d => ({
      productId: d.productId,
      quantity: d.quantity,
      price: d.price
    }));

    // Decode token logic to extract userId, fallback to 1
    let uId = 1;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const decoded = JSON.parse(jsonPayload);
        uId = decoded.id || 1;
      } catch (e) {}
    }

    const order: Order = {
      userId: uId,
      orderDate: new Date().toISOString(),
      status: 'Paid',
      totalAmount: this.total,
      shippingAddress: `${this.checkoutData.address}, ${this.checkoutData.city}, ${this.checkoutData.zip}`,
      items: items
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder: any) => {
        // Clear cart
        this.cartService.updateCartItems(this.cartId, []).subscribe({
          next: () => {
             this.isProcessing = false;
             alert('Order placed successfully! Order ID: ' + createdOrder.id);
             this.router.navigate(['/cart']);
          },
          error: (err: any) => {
             console.error('Failed to clear cart', err);
             this.isProcessing = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Failed to create order', err);
        this.isProcessing = false;
      }
    });
  }
}
