import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItemDetail } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { CartItem } from '../../../core/models/cart.model';
import { BookingService } from '../../../core/services/booking.service';

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
    , private bookingService: BookingService
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
    // Build booking payload and navigate to booking confirmation
    const bookingPayload = {
      confirmationNumber: `#BK-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
      hotelName: this.cartDetails[0]?.product?.name || 'Selected Property',
      checkIn: new Date().toISOString(),
      checkOut: (() => { const d = new Date(); d.setDate(d.getDate() + 4); return d.toISOString(); })(),
      durationNights: 4,
      guests: '2 Adults',
      subtotal: this.subtotal,
      conciergeFee: 0,
      totalPaid: this.total,
      paymentMethod: this.checkoutData.paymentMethod === 'creditCard' ? `Card •••• ${this.checkoutData.cardNumber.slice(-4)}` : this.checkoutData.paymentMethod,
      email: this.checkoutData.email
    };

    this.bookingService.setBooking(bookingPayload as any);
    this.router.navigate(['/booking-confirmation']);
  }
}
