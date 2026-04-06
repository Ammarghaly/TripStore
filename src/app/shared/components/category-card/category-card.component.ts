import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../core/models/category';


@Component({
  selector: 'app-category-card',
  standalone: false,
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  // @Input() name: string = '';
  // @Input() imageUrl: string = '';
  @Input() category!: Category;

  @Output() categoryClick = new EventEmitter<number>()

  onClick(){
    this.categoryClick.emit(this.category.id)
  }
}
