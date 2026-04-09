import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: false,
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.css'
})
export class ProductGalleryComponent {

  @Input({required:true}) image!: string;

}