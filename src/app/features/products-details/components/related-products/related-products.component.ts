import { Component, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';

@Component({
  selector: 'app-related-products',
  standalone: false,
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css'
})
export class RelatedProductsComponent {

  @Input({required:true}) products!: Iproduct[];

}