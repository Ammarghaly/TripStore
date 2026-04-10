import { Component, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input({required:true}) product!: Iproduct;

}