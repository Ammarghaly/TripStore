import { Component, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {

  @Input({required:true}) product!: Iproduct;

  quantity = 1;


  increaseQ(){
    this.quantity++;
  }


  decreaseQ(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }

}