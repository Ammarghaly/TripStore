import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart-test-card',
  templateUrl: './cart-test-card.component.html',
  styleUrls: ['./cart-test-card.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartTestCardComponent implements OnInit {
  cart: any = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  
  newItem = {
    productId: 1,
    quantity: 1,
    price: 99.99
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.message = '✗ Please login first';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.cartService.getCart().subscribe(
      (data) => {
        this.cart = data;
        this.message = `✓ Cart loaded with ${data.details.length} items`;
        this.messageType = 'success';
        this.loading = false;
      },
      (error) => {
        this.message = `✗ Failed to load cart: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  addItem(): void {
    if (!this.cart || !this.cart.cart.id) {
      this.message = '✗ Cart not loaded or invalid';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.cartService.addItemToCart(this.cart.cart.id, this.newItem).subscribe(
      (data) => {
        this.message = `✓ Item added to cart`;
        this.messageType = 'success';
        this.loading = false;
        this.loadCart();
      },
      (error) => {
        this.message = `✗ Failed to add item: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  removeItem(productId: number): void {
    if (!this.cart || !this.cart.cart.id) {
      this.message = '✗ Cart not loaded';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.cartService.removeItemFromCart(this.cart.cart.id, productId).subscribe(
      (data) => {
        this.message = `✓ Item removed from cart`;
        this.messageType = 'success';
        this.loading = false;
        this.loadCart();
      },
      (error) => {
        this.message = `✗ Failed to remove item: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  clearCart(): void {
    if (!this.cart || !this.cart.cart.id) {
      this.message = '✗ Cart not loaded';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.cartService.clearCart(this.cart.cart.id).subscribe(
      (data) => {
        this.message = `✓ Cart cleared`;
        this.messageType = 'success';
        this.loading = false;
        this.loadCart();
      },
      (error) => {
        this.message = `✗ Failed to clear cart: ${error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
