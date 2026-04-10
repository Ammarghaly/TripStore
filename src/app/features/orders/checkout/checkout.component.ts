import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItemDetail } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { CartItem } from '../../../core/models/cart.model';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

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
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'creditCard',
    cardNumber: '4532015112830366',
    expiry: '12/25',
    cvc: '123'
  };

  checkoutForm!: FormGroup;

  isProcessing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
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

  initForm() {
    this.checkoutForm = this.fb.group({
      fullName: [this.checkoutData.fullName, [Validators.required, Validators.minLength(3)]],
      email: [this.checkoutData.email, [Validators.required, Validators.email]],
      phone: [this.checkoutData.phone, [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(7)]],
      address: [this.checkoutData.address],
      city: [this.checkoutData.city],
      zip: [this.checkoutData.zip],
      paymentMethod: [this.checkoutData.paymentMethod, Validators.required],
      cardNumber: [this.checkoutData.cardNumber],
      expiry: [this.checkoutData.expiry],
      cvc: [this.checkoutData.cvc]
    });

    this.checkoutForm.valueChanges.subscribe(v => Object.assign(this.checkoutData, v));
    
    this.updatePaymentValidators();
    
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(() => {
      this.updatePaymentValidators();
    });
  }

  updatePaymentValidators() {
    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;
    const cardNumber = this.checkoutForm.get('cardNumber');
    const expiry = this.checkoutForm.get('expiry');
    const cvc = this.checkoutForm.get('cvc');

    if (paymentMethod === 'creditCard') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      expiry?.setValidators([Validators.required, this.expiryValidator()]);
      cvc?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardNumber?.clearValidators();
      expiry?.clearValidators();
      cvc?.clearValidators();
    }

    cardNumber?.updateValueAndValidity();
    expiry?.updateValueAndValidity();
    cvc?.updateValueAndValidity();
  }

  selectPaymentMethod(method: string) {
    this.checkoutForm.get('paymentMethod')?.setValue(method);
    
    if (method === 'creditCard') {
      this.checkoutForm.patchValue({
        cardNumber: '4532015112830366',
        expiry: '12/25',
        cvc: '123'
      });
    } else {
      this.checkoutForm.patchValue({
        cardNumber: '',
        expiry: '',
        cvc: ''
      });
    }
  }

  expiryValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const val = (control.value || '').trim();
      if (!val) return { required: true };
      // Accept MM/YY or MM/YYYY
      const parts = val.split('/').map((p: string) => p.trim());
      if (parts.length !== 2) return { invalidFormat: true };
      let month = parseInt(parts[0], 10);
      let year = parseInt(parts[1], 10);
      if (isNaN(month) || isNaN(year)) return { invalidFormat: true };
      if (year < 100) {
        year += 2000;
      }
      if (month < 1 || month > 12) return { invalidMonth: true };
      const exp = new Date(year, month - 1 + 1, 1); // first day of month after expiry
      const now = new Date();
      if (exp <= now) return { expired: true };
      return null;
    };
  }

  calculateTotals() {
    this.subtotal = this.cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = this.subtotal * 0.12; // Using 12% as per HTML requirement
    this.total = this.subtotal + this.tax;
  }

  onConfirm() {
    if (this.cartDetails.length === 0) return;
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    
    this.isProcessing = true;
    const fv = this.checkoutForm.value;
    const userId = this.authService.getUserId() || '1';
    const paymentMethodDisplay = fv.paymentMethod === 'creditCard' 
      ? `Card •••• ${String(fv.cardNumber).slice(-4)}` 
      : 'Cash on Delivery';
    
    const shippingAddress = `${fv.fullName}, ${fv.address}, ${fv.city}, ${fv.zip}`;
    
    const orderPayload: Order = {
      userId: +userId,
      orderDate: new Date().toISOString(),
      totalAmount: this.total,
      status: 'pending',
      shippingAddress: shippingAddress,
      items: this.cartDetails.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (order) => {
        this.cartService.clearCart(this.cartId).subscribe({
          next: () => {
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
              paymentMethod: paymentMethodDisplay,
              email: fv.email,
              phone: fv.phone
            };

            this.bookingService.setBooking(bookingPayload as any);
            this.isProcessing = false;
            this.router.navigate(['/booking-confirmation']);
          },
          error: (err) => {
            console.error('Error clearing cart', err);
            this.isProcessing = false;
          }
        });
      },
      error: (err) => {
        console.error('Error creating order', err);
        this.isProcessing = false;
        alert('Failed to create order. Please try again.');
      }
    });
  }
}
