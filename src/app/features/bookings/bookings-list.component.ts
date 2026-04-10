import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css'],
  standalone: false
})
export class BookingsListComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  orders: Order[] = [];
  loading = true;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.http.get<Order[]>(`http://localhost:3000/orders?userId=${userId}&_sort=orderDate&_order=desc`)
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.loading = false;
        }
      });
  }
}
