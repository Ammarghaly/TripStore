import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, of, catchError, BehaviorSubject, tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

export interface CartItemDetail extends CartItem {
  product?: Product;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cartSubject = new BehaviorSubject<{cart: Cart, details: CartItemDetail[]}>({
    cart: { id: 0, userId: 0, items: [] },
    details: []
  });
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  refreshCart(): void {
    this.getCart().subscribe();
  }

  /**
   * Fetch user's cart with product details
   * GET /carts?userId={id} to retrieve the cart
   */
  getCart(): Observable<{cart: Cart, details: CartItemDetail[]}> {
    const userId = this.authService.getUserId() || '1'; 
    
    if (!userId) {
      console.warn('CartService: No user ID found. Returning empty cart.');
      return of({ cart: { id: 0, userId: 0, items: [] }, details: [] });
    }

    return this.http.get<Cart[]>(`${this.apiUrl}/carts?userId=${userId}`).pipe(
      map(carts => {
        if (carts && carts.length > 0) {
          return carts[0];
        }
        return { id: 0, userId: +userId, items: [] } as Cart;
      }),
      switchMap(cart => {
        if (!cart.items || cart.items.length === 0) {
          return of({ cart, details: [] });
        }
        
        const productRequests = cart.items.map(item => 
          this.http.get<Product>(`${this.apiUrl}/products/${item.productId}`).pipe(
            catchError(err => {
              console.error(`Failed to fetch product ${item.productId}`, err);
              return of(null);
            })
          )
        );
        
        return forkJoin(productRequests).pipe(
          map(products => {
            const details = cart.items.map((item, index) => {
              let product = products[index] || undefined;
              
              return { ...item, product };
            });
            return { cart, details };
          })
        );
      }),
      tap(result => this.cartSubject.next(result)),
      catchError(err => {
        console.error('CartService: Error fetching cart', err);
        return of({ cart: { id: 0, userId: +userId, items: [] }, details: [] });
      })
    );
  }

  /**
   * Add item to cart
   * Strategy: Fetch cart -> Modify items array -> PATCH entire array
   */
  addItemToCart(cartId: number, newItem: CartItem): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/carts/${cartId}`).pipe(
      switchMap(cart => {
        const existingItem = cart.items?.find(item => item.productId === newItem.productId);
        
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = cart.items.map(item =>
            item.productId === newItem.productId
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updatedItems = [...(cart.items || []), newItem];
        }

        return this.updateCartItems(cartId, updatedItems);
      }),
      tap(() => this.refreshCart())
    );
  }

  /**
   * Remove item from cart
   * Strategy: Fetch cart -> Filter out item -> PATCH entire array
   */
  removeItemFromCart(cartId: number, productId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/carts/${cartId}`).pipe(
      switchMap(cart => {
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        return this.updateCartItems(cartId, updatedItems);
      }),
      tap(() => this.refreshCart())
    );
  }

  /**
   * Update item quantity in cart
   */
  updateItemQuantity(cartId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/carts/${cartId}`).pipe(
      switchMap(cart => {
        const updatedItems = cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        ).filter(item => item.quantity > 0);

        return this.updateCartItems(cartId, updatedItems);
      }),
      tap(() => this.refreshCart())
    );
  }

  /**
   * Update entire cart items array
   * PATCH /carts/{cartId} with { "items": [...] }
   */
  updateCartItems(cartId: number, items: CartItem[]): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/carts/${cartId}`, { items });
  }

  /**
   * Clear all items from cart
   * Used after successful order creation
   */
  clearCart(cartId: number): Observable<Cart> {
    return this.updateCartItems(cartId, []).pipe(
      tap(() => this.refreshCart())
    );
  }
}
