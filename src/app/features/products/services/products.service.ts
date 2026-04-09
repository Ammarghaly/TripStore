import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../../core/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  products = signal<Product[]>([]);

  currentPage = signal(1);
  pageSize = 8;

  get pagedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products().slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.products().length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  selectedCategory = signal<number | null>(null);

  setCategory(id: number) {
    this.selectedCategory.set(id);
  }

  getProducts() {
    this.http.get<Product[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.products.set(data);
      },
    });
  }

  getUserCart() {
    return this.http.get<any[]>(`http://localhost:3000/carts?userId=1`);
  }
  //
  addToCart(product: Product) {
    this.getUserCart().subscribe((carts) => {
      let cart = carts[0];
      if (!cart) {
        const newCart = {
          userId: 1,
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        };
        this.http
          .post('http://localhost:3000/carts', newCart)
          .subscribe((res) => console.log('created cart', res));
      } else {
        //update existing cart
        const existingItem = cart.items.find((i: any) => i.productId === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({
            productId: product.id,
            quantity: 1,
            price: product.price,
          });
        }
        this.http
          .put(`http://localhost:3000/carts/${cart.id}`, cart)
          .subscribe((res) => console.log('updated cart', res));
      }
    });
  }
}
