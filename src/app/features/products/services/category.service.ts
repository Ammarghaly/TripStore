import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Category } from '../../../core/models/category';

@Injectable({
  providedIn: 'root',
})
export class CategorySrvice {
  private http = inject(HttpClient);
   categories = signal<Category[]>([])

  getCategories(){
    this.http.get<Category[]>('http://localhost:3000/trips').subscribe({
      next: (data) => {
        this.categories.set(data)
      }
    })
  }
}
