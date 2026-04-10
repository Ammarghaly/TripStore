import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
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

  getUserCart() {
    const userId = this.authService.getUserId() || '1';
    return this.http.get<any[]>(`http://localhost:3000/carts?userId=${userId}`);
  }

  addToCart(product: Product) {
    if (!this.authService.isAuthenticated()) {
      this.alertService.confirm(
        'Login Required',
        'Please login to add items to cart',
        () => {
          this.router.navigate(['/login']);
        }
      );
      return;
    }

    this.getUserCart().subscribe((carts) => {
      let cart = carts[0];
      if (!cart) {
        const userId = this.authService.getUserId() || '1';
        const newCart = {
          userId: +userId,
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        };
        this.http.post('http://localhost:3000/carts', newCart).subscribe({
          next: (res: any) => {
            console.log('created cart', res);
            this.cartService.refreshCart();
            this.alertService.show('Success', 'Product added to cart successfully!');
          },
          error: (err) => {
            console.error('Error creating cart', err);
            if (err.status === 401) {
              this.authService.logout();
              this.alertService.confirm(
                'Session Expired',
                'Your session has expired. Please login again.',
                () => {
                  this.router.navigate(['/login']);
                }
              );
            } else {
              this.alertService.show('Error', 'Failed to add product to cart.');
            }
          }
        });
      } else {
        this.cartService.addItemToCart(cart.id, {
          productId: product.id,
          quantity: 1,
          price: product.price
        }).subscribe({
          next: () => {
            this.alertService.show('Success', 'Product added to cart successfully!');
          },
          error: (err) => {
            console.error('Error adding to cart', err);
            if (err.status === 401) {
              this.authService.logout();
              this.alertService.confirm(
                'Session Expired',
                'Your session has expired. Please login again.',
                () => {
                  this.router.navigate(['/login']);
                }
              );
            } else {
              this.alertService.show('Error', 'Failed to add product to cart.');
            }
          }
        });
      }
    });
  }
}
