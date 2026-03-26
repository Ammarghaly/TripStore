import { Component, inject, OnInit } from '@angular/core';
import { CategorySrvice } from '../../../features/products/services/category.service';

@Component({
  selector: 'app-category-section',
  standalone: false,
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css',
})
export class CategorySectionComponent implements OnInit{
   categoryService  = inject(CategorySrvice)

   ngOnInit(): void {
     this.categoryService.getCategories()
   }
}
