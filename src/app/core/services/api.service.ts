import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private URL = 'http://localhost:3000';
  private http = inject(HttpClient);

  getOrders(): Observable<any> {
    return this.http.get(`${this.URL}/orders`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.URL}/users`);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.URL}/products`);
  }

  getTrips(): Observable<any> {
    return this.http.get(`${this.URL}/trips`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.URL}/products`, product);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post(`${this.URL}/trips`, trip);
  }
}
