import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingService } from '../../core/services/booking.service';

declare var window: any;

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
  , standalone: false
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  loading = true;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.booking = this.bookingService.getBooking();
      this.loading = false;

      if (!this.booking) {
        this.router.navigate(['/checkout']);
      }
    }, 600);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  formatCurrency(amount: number | undefined) {
    if (amount == null) return '-';
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }
}

