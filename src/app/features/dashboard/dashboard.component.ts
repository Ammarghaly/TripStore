import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  mappedOrders: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  availableTrips: any[] = [];

  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalUsers: number = 0;

  newProduct = { name: '', description: '', price: 0, stock: 0, imageUrl: '', tripIds: [] as number[] };
  newTrip = { name: '', description: '', imageUrl: '' };

  productLoading = false;
  tripLoading = false;
  productSuccess = false;
  tripSuccess = false;

  trackById(_: number, item: any) { return item.id; }

  isTripSelected(tripId: number): boolean {
    return this.newProduct.tripIds.includes(tripId);
  }

  toggleTrip(tripId: number, checked: boolean) {
    if (checked) {
      this.newProduct.tripIds = [...this.newProduct.tripIds, tripId];
    } else {
      this.newProduct.tripIds = this.newProduct.tripIds.filter(id => id !== tripId);
    }
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.apiService.getUsers().subscribe((users) => {
      this.totalUsers = users.length;
      this.apiService.getOrders().subscribe((orders) => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce(
          (sum: number, o: any) => sum + (o.totalAmount || 0),
          0
        );
        this.mappedOrders = orders.map((order: any) => {
          const user = users.find((u: any) => u.id === order.userId);
          return {
            ...order,
            customerName: user ? user.name : 'Unknown',
          };
        });
      });
    });

    this.loadProductsAndTrips();
  }

  loadProductsAndTrips() {
    this.apiService.getTrips().subscribe((trips) => {
      this.availableTrips = trips;
      this.apiService.getProducts().subscribe((prods) => {
        this.products = [...prods];
        this.categories = trips.map((trip: any) => ({
          ...trip,
          productCount: prods.filter((p: any) =>
            Array.isArray(p.tripIds) && p.tripIds.includes(trip.id)
          ).length,
        }));
      });
    });
  }

  openAddProductModal() {
    this.newProduct = { name: '', description: '', price: 0, stock: 0, imageUrl: '', tripIds: [] };
    this.productSuccess = false;
    const modalEl = document.getElementById('addProductModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  openAddTripModal() {
    this.newTrip = { name: '', description: '', imageUrl: '' };
    this.tripSuccess = false;
    const modalEl = document.getElementById('addTripModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  submitProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;
    this.productLoading = true;
    this.apiService.addProduct(this.newProduct).subscribe({
      next: () => {
        this.productLoading = false;
        this.productSuccess = true;
        this.loadProductsAndTrips();
        setTimeout(() => {
          const modalEl = document.getElementById('addProductModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
          this.productSuccess = false;
        }, 1200);
      },
      error: () => {
        this.productLoading = false;
      }
    });
  }

  submitTrip() {
    if (!this.newTrip.name) return;
    this.tripLoading = true;
    this.apiService.addTrip(this.newTrip).subscribe({
      next: () => {
        this.tripLoading = false;
        this.tripSuccess = true;
        this.loadProductsAndTrips();
        setTimeout(() => {
          const modalEl = document.getElementById('addTripModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
          this.tripSuccess = false;
        }, 1200);
      },
      error: () => {
        this.tripLoading = false;
      }
    });
  }
}
