import { Component, inject, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';
import { Router } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';

@Component({
  selector: 'app-related-products',
  standalone: false,
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css'
})
export class RelatedProductsComponent {

  @Input({required:true}) products!: Iproduct[];

  private router = inject(Router);
  private productsService = inject(ProductsService);

  goToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: Iproduct) {
    this.productsService.addToCart(product as any);
  }

}