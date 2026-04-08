import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-test-card',
  templateUrl: './auth-test-card.component.html',
  styleUrls: ['./auth-test-card.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AuthTestCardComponent implements OnInit {
  form: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  userId: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required]],
      name: ['Test User', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.checkUserId();
  }

  onLogin(): void {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe(
      (response) => {
        this.message = `✓ Login successful! Token: ${response.accessToken.substring(0, 20)}...`;
        this.messageType = 'success';
        this.loading = false;
        this.checkUserId();
      },
      (error) => {
        this.message = `✗ Login failed: ${error.message || error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  onRegister(): void {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.authService.register({
      email: this.form.value.email,
      password: this.form.value.password,
      name: this.form.value.name
    }).subscribe(
      (response) => {
        this.message = `✓ Registration successful! Token: ${response.accessToken.substring(0, 20)}...`;
        this.messageType = 'success';
        this.loading = false;
        this.checkUserId();
      },
      (error) => {
        this.message = `✗ Registration failed: ${error.message || error.statusText}`;
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  checkUserId(): void {
    this.userId = this.authService.getUserId();
  }

  onLogout(): void {
    this.authService.logout();
    this.userId = null;
    this.message = '✓ Logged out successfully';
    this.messageType = 'success';
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
