import { Component, inject, OnInit } from '@angular/core';
import { CategorySrvice } from '../../products/services/category.service';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
  host:{
    class: 'd-block min-vh-100 bg-black'
  }
})
export class CategoriesPageComponent implements OnInit {
  categoryService = inject(CategorySrvice);

  ngOnInit(): void {
    this.categoryService.getCategories();
  }
}
