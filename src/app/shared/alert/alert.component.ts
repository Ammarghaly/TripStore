import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, AlertConfig } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  alertConfig: AlertConfig | null = null;
  isVisible = false;
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.alert$.subscribe(config => {
      this.alertConfig = config;
      this.isVisible = !!config;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onConfirm() {
    if (this.alertConfig?.onConfirm) {
      this.alertConfig.onConfirm();
    }
    this.close();
  }

  onCancel() {
    if (this.alertConfig?.onCancel) {
      this.alertConfig.onCancel();
    }
    this.close();
  }

  close() {
    this.isVisible = false;
    setTimeout(() => {
      this.alertService.close();
    }, 300);
  }
}
