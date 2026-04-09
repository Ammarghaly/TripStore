import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './features/products/products-page/products-page.component';
import { CategorySectionComponent } from './shared/components/category-section/category-section.component';

const routes: Routes = [ 
  // { path: 'products/:id', component: ProductDetailsComponent }, 
  {path: 'product', component: ProductsPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
