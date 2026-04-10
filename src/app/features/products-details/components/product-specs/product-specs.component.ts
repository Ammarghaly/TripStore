import { Component, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';

@Component({
  selector: 'app-product-specs',
  standalone: false,
  templateUrl: './product-specs.component.html',
  styleUrl: './product-specs.component.css'
})
export class ProductSpecsComponent {

  @Input({required:true}) product!: Iproduct;

}