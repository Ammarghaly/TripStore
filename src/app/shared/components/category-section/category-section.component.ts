import { Component, inject, OnInit } from '@angular/core';
import { CategorySrvice } from '../../../features/products/services/category.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../../features/products/services/products.service';

@Component({
  selector: 'app-category-section',
  standalone: false,
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css',
})
export class CategorySectionComponent implements OnInit{
   categoryService  = inject(CategorySrvice)
  //  productService = inject(ProductsService);
   router = inject(Router)

   ngOnInit(): void {
     this.categoryService.getCategories()
   }
   onCategoryClick(id:number){
    this.router.navigate(['/products', id])
   }
  
}
