import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
  host: {
    class: 'd-block min-vh-100 bg-black',
  },
})
export class ProductsPageComponent implements OnInit {
  productService = inject(ProductsService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  categoryId!: number;

  totalPages = computed(() => {
  return Math.ceil(this.filteredProducts().length / this.productService.pageSize);
});

  filteredProducts = computed(() => {
    const products = this.productService.products();
    const id = this.productService.selectedCategory();

    if (!id) return products;

    return products.filter((p) => p.tripIds.includes(id));
  });
  pagedFilteredProducts = computed(() => {
  const products = this.filteredProducts();
  const page = this.productService.currentPage();
  const size = this.productService.pageSize;

  const start = (page - 1) * size;
  const end = start + size;

  return products.slice(start, end);
});

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    this.productService.setCategory(this.categoryId);

    this.productService.getProducts();
  }

  handleAddToCart(product: Product) {
  this.productService.addToCart(product);
}

}
