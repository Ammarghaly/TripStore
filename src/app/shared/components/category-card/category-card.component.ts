import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Category } from '../../../core/models/category';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-card',
  standalone: false,
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
 
  @Input() category!: Category;

  @Output() categoryClick = new EventEmitter<number>()

  router = inject(Router);

  goToProducts(id: number) {
  this.router.navigate(['/products', id]);
}
}
