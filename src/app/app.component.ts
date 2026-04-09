<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, signal, inject, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
>>>>>>> origin/dashboard

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
})
<<<<<<< HEAD
export class AppComponent {}
=======
export class App implements OnInit {
  protected readonly title = signal('TripStore');
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.login({ email: 'admin@example.com', password: 'admin123' }).subscribe({
      next: () => console.log('Admin logged in automatically, token secured in localStorage.'),
      error: (err) => console.error('Failed to auto-login admin:', err)
    });
  }
}
>>>>>>> origin/dashboard
