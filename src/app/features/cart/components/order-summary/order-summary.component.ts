import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  standalone: false
})
export class OrderSummaryComponent {
  @Input() subtotal: number = 0;
  @Input() shippingText: string = '';
  @Input() tax: number = 0;
  @Input() total: number = 0;
  
  promoCode: string = '';

  onApplyPromo() {
    // Promo code logic here
  }

  onProceedToCheckout() {
    // Proceed logic
  }
}
