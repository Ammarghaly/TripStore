import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn: boolean = true;
  
  currentUser = {
    name: 'John Doe',
    email: 'user@example.com'
  };
  
  showUserMenu: boolean = false;
  
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchDropdown: boolean = false;

  showCartDropdown: boolean = false;
  cartItems = [
    {
      id: 1,
      name: 'Professional Fishing Rod',
      price: 120.5,
      quantity: 1
    },
    {
      id: 3,
      name: 'Sun Protection Hat',
      price: 15.0,
      quantity: 2
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Header component loaded');
    console.log('isLoggedIn:', this.isLoggedIn);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.isLoggedIn = false;
    this.showUserMenu = false;
    console.log('User logged out');
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
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
  }
}
