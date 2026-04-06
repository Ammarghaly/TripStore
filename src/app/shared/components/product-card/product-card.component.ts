import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() products!:Product;

  // add to 
  @Output() addToCart = new EventEmitter<Product>();
  onAddToCart() {
    this.addToCart.emit(this.products);
  }
}
