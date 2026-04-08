import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings-list',
  template: `
    <div class="container text-white py-5">
      <h2>Your Bookings</h2>
      <p class="text-muted">(This is a placeholder bookings page.)</p>
      <div class="card bg-dark text-light p-4 mt-3">
        <strong>No bookings yet.</strong>
      </div>
    </div>
  `,
  standalone: false
})
export class BookingsListComponent {}
