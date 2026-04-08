import { Injectable } from '@angular/core';

export interface Booking {
  confirmationNumber: string;
  hotelName: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  durationNights: number;
  guests: string;
  subtotal: number;
  conciergeFee?: number;
  totalPaid: number;
  paymentMethod?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private storageKey = 'mock_booking';

  constructor() {}

  saveBooking(booking: Booking) {
    localStorage.setItem(this.storageKey, JSON.stringify(booking));
  }

  getBooking(): Booking | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Booking;
    } catch (e) {
      console.error('Failed to parse booking from storage', e);
      return null;
    }
  }

  // Provide a mocked booking used when no booking is saved
  getMockBooking(): Booking {
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setDate(checkIn.getDate() + 4);

    return {
      confirmationNumber: '#OB-8829-XQ',
      hotelName: 'The Obsidian Onyx Suite',
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      durationNights: 4,
      guests: '2 Adults',
      subtotal: 4200,
      conciergeFee: 350,
      totalPaid: 4550,
      paymentMethod: 'Obsidian Metal Card •••• 9901',
      email: 'alex.v@obsidian.com'
    };
  }

  // Compatibility API requested: setBooking
  setBooking(booking: Booking) {
    this.saveBooking(booking);
  }
}
