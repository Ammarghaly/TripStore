import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertConfig {
  title: string;
  message: string;
  isConfirm: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<AlertConfig | null>();
  alert$ = this.alertSubject.asObservable();

  show(title: string, message: string) {
    this.alertSubject.next({
      title,
      message,
      isConfirm: false
    });
  }

  confirm(title: string, message: string, onConfirm?: () => void, onCancel?: () => void) {
    this.alertSubject.next({
      title,
      message,
      isConfirm: true,
      onConfirm,
      onCancel
    });
  }

  close() {
    this.alertSubject.next(null);
  }
}
