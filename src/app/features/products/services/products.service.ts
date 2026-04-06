import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../../core/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  ptoducts = signal<Product[]>([]);

  getProducts() {
    this.http.get<Product[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.ptoducts.set(data);
      },
    });
  }
}
