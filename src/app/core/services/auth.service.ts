import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

interface LoginResponse {
  accessToken: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Register a new user
   * @param user User registration data { email, password, name }
   */
  register(user: RegisterPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, user).pipe(
      map(response => {
        this.storeToken(response.accessToken);
        return response;
      })
    );
  }

  /**
   * Login user with email and password
   * @param credentials { email, password }
   */
  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        this.storeToken(response.accessToken);
        return response;
      })
    );
  }

  /**
   * Get current user ID from stored JWT token
   * Uses jwt-decode to parse the token payload
   */
  getUserId(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded: any = jwt_decode.jwtDecode(token);
      return decoded?.sub || decoded?.userId || decoded?.id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get the stored access token
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Store access token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Logout - remove token and clear user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
