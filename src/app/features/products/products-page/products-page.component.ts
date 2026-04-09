import { Component, inject, OnInit, computed, signal } from '@angular/core';
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
    class: 'd-block min-vh-100',
    '[style.background-color]': '"#181A19"',
  },
})
export class ProductsPageComponent implements OnInit {
  productService = inject(ProductsService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  categoryId!: number;
  
  minPrice = signal(0);
  maxPrice = signal(500);

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.productService.pageSize);
  });

  filteredProducts = computed(() => {
    const products = this.productService.products();
    const id = this.productService.selectedCategory();
    const min = this.minPrice();
    const max = this.maxPrice();

    let filtered = products;

    if (id) {
      filtered = filtered.filter((p) => p.tripIds.includes(id));
    }

    filtered = filtered.filter((p) => p.price >= min && p.price <= max);

    return filtered;
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

  selectCategory(categoryId: number | null) {
    this.productService.setCategory(categoryId);
    this.productService.currentPage.set(1);
  }

  onPriceChange() {
    this.productService.currentPage.set(1);
  }
}
