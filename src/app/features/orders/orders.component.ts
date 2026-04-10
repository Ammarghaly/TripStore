import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../shared/alert/alert.service';

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
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  
  orders: Order[] = [];
  loading = true;
  openDropdownId: number | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<Order[]>('http://localhost:3000/orders?_sort=orderDate&_order=desc')
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

  toggleDropdown(orderId: number) {
    this.openDropdownId = this.openDropdownId === orderId ? null : orderId;
  }

  updateOrderStatus(order: Order, newStatus: string) {
    this.openDropdownId = null;
    this.http.patch(`http://localhost:3000/orders/${order.id}`, { status: newStatus })
      .subscribe({
        next: () => {
          order.status = newStatus;
          this.alertService.show('Success', `Order status updated to ${newStatus}`);
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.alertService.show('Error', 'Failed to update order status');
        }
      });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }
}
