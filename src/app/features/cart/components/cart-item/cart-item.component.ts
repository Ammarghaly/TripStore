import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItemDetail } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: false
})
export class CartItemComponent {
  @Input() item!: CartItemDetail;
  @Output() quantityChange = new EventEmitter<{ productId: number, quantity: number }>();
  @Output() removeItem = new EventEmitter<number>();

  increment() {
    this.quantityChange.emit({ productId: this.item.productId, quantity: this.item.quantity + 1 });
  }

  decrement() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({ productId: this.item.productId, quantity: this.item.quantity - 1 });
    }
  }

  remove() {
    this.removeItem.emit(this.item.productId);
  }

  getBadgeText(): string {
    if (!this.item.product) return '';
    // Based on the image: "IN STOCK" or "ECO-FRIENDLY"
    return this.item.product.id % 2 === 0 ? 'IN STOCK' : 'ECO-FRIENDLY';
  }

  getBadgeClass(): string {
    const text = this.getBadgeText();
    return text === 'IN STOCK' ? 'badge-in-stock' : 'badge-eco';
  }

  getBadgeStatus(): string {
    if (!this.item.product) return '';
    return 'Ready to ship';
  }

  getSkuSuffix(): string {
    // Based on image: "Sage Green" or "Titanium Gray"
    const colors = ['Sage Green', 'Titanium Gray', 'Ocean Blue', 'Midnight Black'];
    return colors[this.item.productId % colors.length];
  }
}
