import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../../shared/alert/alert.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService, CartItemDetail } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  currentUser: any = null;
  showUserMenu: boolean = false;
  
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchDropdown: boolean = false;

  showCartDropdown: boolean = false;
  cartItems: CartItemDetail[] = [];
  cartId: number = 0;

  private cartSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (response) => {
        this.cartId = response.cart.id;
        this.cartItems = response.details;
      }
    });

    this.cartService.refreshCart();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.alertService.confirm(
      'Confirm Logout',
      'Are you sure you want to logout?',
      () => {
        this.authService.logout();
        this.isLoggedIn = false;
        this.currentUser = null;
        this.showUserMenu = false;
        this.alertService.show('Success', 'Logged out successfully');
        this.router.navigate(['/']);
      }
    );
  }

  onSearchInput() {
    console.log('Search query:', this.searchQuery);
    if (this.searchQuery.trim().length > 0) {
      this.http.get(`http://localhost:3000/products?q=${this.searchQuery}`)
        .subscribe((results: any) => {
          console.log('Search results:', results);
          this.searchResults = results;
          this.showSearchDropdown = true;
          console.log('Dropdown should show:', this.showSearchDropdown);
        });
    } else {
      this.searchResults = [];
      this.showSearchDropdown = false;
    }
  }

  selectProduct(product: any) {
    console.log('Selected:', product);
    this.showSearchDropdown = false;
    this.searchQuery = '';
  }

  hideSearchDropdown() {
    setTimeout(() => {
      this.showSearchDropdown = false;
    }, 200);
  }

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price;
      return total + (price * item.quantity);
    }, 0);
  }

  getCartCount() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(productId: number) {
    this.alertService.confirm(
      'Remove Item',
      'Remove this item from cart?',
      () => {
        this.cartService.removeItemFromCart(this.cartId, productId).subscribe({
          next: () => {
            this.alertService.show('Removed', 'Item removed from cart');
          },
          error: (error) => {
            console.error('Error removing item:', error);
            this.alertService.show('Error', 'Failed to remove item');
          }
        });
      }
    );
  }

  viewCart() {
    this.showCartDropdown = false;
    this.router.navigate(['/cart']);
  }

}

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }
