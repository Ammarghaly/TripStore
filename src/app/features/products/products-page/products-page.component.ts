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
    style: 'background-color: #1A1A1A',
  },
})
export class ProductsPageComponent implements OnInit {
  productService = inject(ProductsService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  categoryId!: number;
  
  minPrice = signal(0);
  maxPrice = signal(500);

  selectedTag: string | null = null;

  get minPricePercent() {
    return (this.minPrice() / 500) * 100;
  }

  get maxPricePercent() {
    return (this.maxPrice() / 500) * 100;
  }

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
    const categoryIdParam = this.route.snapshot.paramMap.get('categoryId');
    this.categoryId = categoryIdParam ? Number(categoryIdParam) : 0;

    if (this.categoryId) {
      this.productService.setCategory(this.categoryId);
    } else {
      this.productService.setCategory(null);
    }

    this.productService.getProducts();
  }

  handleAddToCart(product: Product) {
    this.productService.addToCart(product);
  }

  selectCategory(categoryId: number | null) {
    this.productService.setCategory(categoryId);
    this.productService.goToPage(1);
  }

  onPriceChange() {
    if (this.minPrice() > this.maxPrice()) {
      const temp = this.minPrice();
      this.minPrice.set(this.maxPrice());
      this.maxPrice.set(temp);
    }
  }

  selectTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? null : tag;
  }
}
