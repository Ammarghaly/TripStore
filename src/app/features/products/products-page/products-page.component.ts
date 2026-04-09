import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../../../core/models/product';


@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
  host: {
    class: 'd-block min-vh-100 bg-black'
  }
})
export class ProductsPageComponent implements OnInit {
  router = inject(Router);

  productService = inject(ProductsService);
  route = inject(ActivatedRoute);

  categoryId!: number;

  filteredProducts = computed(() => {
    const products = this.productService.products()
    const id = this.categoryId

    if(!id) return products

    return products.filter(p => p.tripIds.includes(id))
  });

  ngOnInit(): void {
    
    this.productService.getProducts()

    this.route.paramMap.subscribe(params =>{
      this.categoryId = Number(params.get('id'))
    })
  }

  handleAddToCart(product: Product) {
    console.log(product);
  }

  goToDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }
}
