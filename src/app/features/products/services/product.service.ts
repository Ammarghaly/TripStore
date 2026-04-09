import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models/product.model';

interface Trip {
  id: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Get all available trips
   */
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/trips`);
  }

  /**
   * Get products by trip IDs
   * @param tripIds Array of trip IDs to filter products
   */
  getProductsByTrip(tripIds: number[]): Observable<Product[]> {
    let params = new HttpParams();
    tripIds.forEach(id => {
      params = params.append('tripIds', id.toString());
    });
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Search products by name
   * @param keyword Search keyword for product name
   */
  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('name_like', keyword);
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Filter products by price range
   * @param minPrice Minimum price (inclusive)
   * @param maxPrice Maximum price (inclusive)
   */
  filterByPrice(minPrice: number, maxPrice: number): Observable<Product[]> {
    let params = new HttpParams();
    params = params.set('price_gte', minPrice.toString());
    params = params.set('price_lte', maxPrice.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Sort products by a specific field
   * @param sortField Field to sort by (e.g., 'price')
   * @param order Sort order: 'asc' or 'desc'
   */
  sortProducts(sortField: string = 'price', order: 'asc' | 'desc' = 'asc'): Observable<Product[]> {
    let params = new HttpParams();
    params = params.set('_sort', sortField);
    params = params.set('_order', order);
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Get all products with optional filters
   * @param filters Optional filters object with price, search, sort, etc.
   */
  getProducts(filters?: {
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    tripIds?: number[];
  }): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.keyword) {
      params = params.set('name_like', filters.keyword);
    }
    if (filters?.minPrice !== undefined) {
      params = params.set('price_gte', filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params = params.set('price_lte', filters.maxPrice.toString());
    }
    if (filters?.sortField) {
      params = params.set('_sort', filters.sortField);
      params = params.set('_order', filters.sortOrder || 'asc');
    }
    if (filters?.tripIds && filters.tripIds.length > 0) {
      filters.tripIds.forEach(id => {
        params = params.append('tripIds', id.toString());
      });
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Get a single product by ID
   * @param id Product ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
