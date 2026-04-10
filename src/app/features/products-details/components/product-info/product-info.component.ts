import { Component, inject, Input } from '@angular/core';
import { Iproduct } from '../../model/product-interface';
import { CartService } from '../../../../core/services/cart.service';
import { AlertService } from '../../../../shared/alert/alert.service';
import { CartItem } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {

  @Input({required:true}) product!: Iproduct;

  quantity = 1;

  private cartService = inject(CartService);
  private alertService = inject(AlertService);

  increaseQ(){
    this.quantity++;
  }

  decreaseQ(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  addToCart() {
    this.cartService.getCart().subscribe({
      next: (result) => {
        const cartItem: CartItem = {
          productId: this.product.id,
          quantity: this.quantity,
          price: this.product.price
        };

        if (result.cart.id) {
          this.cartService.addItemToCart(result.cart.id, cartItem).subscribe({
            next: () => {
              this.alertService.show('Success', `${this.product.name} added to cart!`);
              this.quantity = 1;
            },
            error: (err: any) => {
              this.alertService.show('Error', 'Failed to add item to cart');
              console.error(err);
            }
          });
        } else {
          this.alertService.show('Error', 'Cart not found. Please login.');
        }
      },
      error: (err: any) => {
        this.alertService.show('Error', 'Failed to get cart');
        console.error(err);
      }
    });
  }

}