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
  showModal = false;
  showToast = false;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // simulate loading
    setTimeout(() => {
      this.booking = this.bookingService.getBooking();
      this.loading = false;

      if (!this.booking) {
        // No booking to show – redirect back to checkout
        this.router.navigate(['/checkout']);
      }
    }, 600);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  async downloadPdf() {
    // Use html2canvas + jsPDF to capture the booking card
    try {
      const element = document.getElementById('booking-card');
      if (!element) return;

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save((this.booking?.confirmationNumber || 'booking') + '.pdf');
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('PDF generation failed. Please ensure dependencies are installed: html2canvas, jspdf');
    }
  }

  saveBooking() {
    if (!this.booking) return;
    this.bookingService.saveBooking(this.booking);
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3500);
  }

  openConfirmModal() {
    this.showModal = true;
  }

  closeConfirmModal() {
    this.showModal = false;
  }

  formatCurrency(amount: number | undefined) {
    if (amount == null) return '-';
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }
}

