import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertService } from '../../../shared/alert/alert.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
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

  setCategory(id: number | null) {
    this.selectedCategory.set(id);
  }

  getProducts() {
    this.http.get<Product[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.products.set(data);
      },
    });
  }

  addToCart(product: Product) {
    if (!this.authService.isAuthenticated()) {
      this.alertService.confirm(
        'Login Required',
        'You need to login to add items to cart',
        () => {
          this.router.navigate(['/login']);
        }
      );
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.alertService.show('Error', 'Unable to get user information');
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/carts?userId=${userId}`)
      .pipe(
        switchMap(carts => {
          let cart = carts[0];
          
          if (!cart) {
            const newCart = {
              userId: +userId,
              items: [{
                productId: product.id,
                quantity: 1,
                price: product.price,
              }],
            };
            return this.http.post('http://localhost:3000/carts', newCart);
          } else {
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
            return this.http.put(`http://localhost:3000/carts/${cart.id}`, cart);
          }
        }),
        catchError(error => {
          if (error.status === 401) {
            this.alertService.show('Session Expired', 'Please login again');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.alertService.show('Error', 'Failed to add product to cart');
          }
          return of(null);
        }),
        finalize(() => {
          this.cartService.refreshCart();
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.alertService.show('Success', 'Product added to cart successfully');
          }
        },
        error: (error) => {
          console.error('Error adding to cart', error);
        }
      });
  }
}
