import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  constructor(private router: Router){}

  
  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  goToDetails() {
  this.router.navigate(['/product', this.product.id]);
}
}
