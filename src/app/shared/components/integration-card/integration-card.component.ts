import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integration-card',
  templateUrl: './integration-card.component.html',
  styleUrls: ['./integration-card.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class IntegrationCardComponent {
  guideUrl = '/assets/docs/API-Integration-Guide.md';
}
