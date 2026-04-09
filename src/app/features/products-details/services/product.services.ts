import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Iproduct } from '../model/product-interface';

@Injectable({
  providedIn: 'root'
})
export class Product {

  private http = inject(HttpClient);

  products: Iproduct[] = [];


 getProducts(){
  return this.http.get<Iproduct[]>('http://localhost:3000/products');
}
getProductById(id:number){
  return this.http.get<Iproduct>(
    `http://localhost:3000/products/${id}`
  );
}


  get productList(): Iproduct[] {
    return this.products;
  }


  get mainProduct(): Iproduct {
    return this.products[0];
  }


  get relatedProducts(): Iproduct[] {
    return this.products.slice(1);
  }

}