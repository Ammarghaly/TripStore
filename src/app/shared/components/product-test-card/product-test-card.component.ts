import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../features/products/services/product.service';

@Component({
  selector: 'app-product-test-card',
  templateUrl: './product-test-card.component.html',
  styleUrls: ['./product-test-card.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductTestCardComponent implements OnInit {
  products: any[] = [];
  trips: any[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  
  filters = {
    keyword: '',
    minPrice: 0,
    maxPrice: 1000,
    sortField: 'price',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.productService.getTrips().subscribe(
      (data) => {
        this.trips = data;
        this.message = `✓ Loaded ${data.length} trips`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Failed to load trips: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  loadAllProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.filters).subscribe(
      (data) => {
        this.products = data;
        this.message = `✓ Loaded ${data.length} products`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Failed to load products: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  searchProducts(): void {
    if (!this.filters.keyword) {
      this.message = '✗ Please enter a search keyword';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.productService.searchProducts(this.filters.keyword).subscribe(
      (data) => {
        this.products = data;
        this.message = `✓ Found ${data.length} products matching "${this.filters.keyword}"`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Search failed: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  filterByPrice(): void {
    this.loading = true;
    this.productService.filterByPrice(this.filters.minPrice, this.filters.maxPrice).subscribe(
      (data) => {
        this.products = data;
        this.message = `✓ Found ${data.length} products in price range $${this.filters.minPrice}-$${this.filters.maxPrice}`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Filter failed: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  sortProducts(): void {
    this.loading = true;
    this.productService.sortProducts(this.filters.sortField, this.filters.sortOrder).subscribe(
      (data) => {
        this.products = data;
        this.message = `✓ Sorted ${data.length} products by ${this.filters.sortField} (${this.filters.sortOrder})`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Sort failed: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  clearResults(): void {
    this.products = [];
    this.message = '';
    this.messageType = '';
  }
}
