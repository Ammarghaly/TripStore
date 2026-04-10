import { Component, OnInit } from '@angular/core';
import { CartService, CartItemDetail } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartId = 0;
  cartDetails: CartItemDetail[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;
  shippingText = 'Calculated at checkout';
  
  products = [
    { name: 'Willow Wanderer Kit', price: 149.0, image: 'https://via.placeholder.com/120?text=Willow+Wanderer' },
    { name: 'Compact Trek Grill', price: 89.0, image: 'https://via.placeholder.com/120?text=Trek+Grill' },
    { name: 'Explorer Tent', price: 199.0, image: 'https://via.placeholder.com/120?text=Tent' },
    { name: 'Hiking Boots', price: 129.0, image: 'https://via.placeholder.com/120?text=Boots' }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartId = res.cart.id;
        this.cartDetails = res.details;
        this.calculateTotals();

        if (this.cartDetails.length === 0 && !localStorage.getItem('accessToken')) {
          console.warn('CartComponent: No items found and user is not logged in.');
        }
      },
      error: (err: any) => {
        console.error('Failed to load cart', err);
      }
    });
  }

  calculateTotals() {
    this.subtotal = this.cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = 0; // Tax is 0 per screenshot
    this.total = this.subtotal + this.tax;
  }

  onQuantityChange(event: { productId: number, quantity: number }) {
    const item = this.cartDetails.find(i => i.productId === event.productId);
    if (item) {
      if (event.quantity <= 0) {
        this.cartDetails = this.cartDetails.filter(i => i.productId !== event.productId);
      } else {
        item.quantity = event.quantity;
      }
      this.calculateTotals();
      this.saveCartItems();
    }
  }

  onRemoveItem(productId: number) {
    this.cartDetails = this.cartDetails.filter(i => i.productId !== productId);
    this.calculateTotals();
    this.saveCartItems();
  }

  saveCartItems() {
    const items: CartItem[] = this.cartDetails.map(d => ({
      productId: d.productId,
      quantity: d.quantity,
      price: d.price
    }));
    
    this.cartService.updateCartItems(this.cartId, items).subscribe({
      next: (res: any) => {},
      error: (err: any) => console.error('Failed to update cart', err)
    });
  }
}
