import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../services/product.services';
import { Iproduct } from '../../model/product-interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
route =inject(ActivatedRoute);

  productSer = inject(Product);

  products: Iproduct[] = [];

  Product!: Iproduct;

  relatedProducts: Iproduct[] = [];



ngOnInit(): void {

  const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  this.productSer.getProductById(id).subscribe({

    next:(res)=>{
      this.Product = res;
    },

    error:(err)=>{
      console.log(err);
    }

  });

}
}