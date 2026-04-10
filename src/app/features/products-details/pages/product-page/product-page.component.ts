import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../services/product.services';
import { Iproduct } from '../../model/product-interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  productSer = inject(Product);

  products: Iproduct[] = [];
  Product!: Iproduct;
  relatedProducts: Iproduct[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    window.scrollTo(0, 0);

    this.productSer.getProductById(id).subscribe({
      next: (res) => {
        this.Product = res;
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });

    this.productSer.getProducts().subscribe({
      next: (res) => {
        this.relatedProducts = res.filter(p => p.id !== id).slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }
}