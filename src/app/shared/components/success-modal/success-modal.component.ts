import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css'],
  standalone: false
})
export class SuccessModalComponent {
  /** Controls whether the modal is visible */
  @Input() isVisible = false;

  /** Heading shown inside the modal */
  @Input() title = 'Booking Confirmed!';

  /** Sub-text shown below the heading */
  @Input() message = 'Your transaction was successful and secure.';

  /** Emitted when the user dismisses the modal (backdrop click or button) */
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  onBackdropClick() {
    this.close();
  }
}
