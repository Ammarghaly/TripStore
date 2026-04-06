import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../features/products/services/products.service';

@Component({
  selector: 'app-products-section',
  standalone: false,
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.css',
})
export class ProductsSectionComponent implements OnInit {
  productService = inject(ProductsService);

  ngOnInit(): void {
    this.productService.getProducts();
  }
}
