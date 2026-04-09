import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
// import { ServiceTestDashboardComponent } from './shared/components/service-test-dashboard/service-test-dashboard.component';
import { BookingConfirmationComponent } from './features/bookings/booking-confirmation.component';
import { BookingsListComponent } from './features/bookings/bookings-list.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsPageComponent } from './features/products/products-page/products-page.component';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page.component';
import { CategorySectionComponent } from './shared/components/category-section/category-section.component';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '', component: HomeComponent },
  // { path: 'test', component: ServiceTestDashboardComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'bookings', component: BookingsListComponent },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) },
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/:categoryId', component: ProductsPageComponent },
  //{ path: 'product-details/:id', component: ProductDetailsPageComponent }
];







@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {}
