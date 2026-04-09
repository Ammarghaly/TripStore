import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { BookingConfirmationComponent } from './features/bookings/booking-confirmation.component';
import { BookingsListComponent } from './features/bookings/bookings-list.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsPageComponent } from './features/products/products-page/products-page.component';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProductsComponent } from './features/products/products.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { UsersComponent } from './features/users/users.component';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'bookings', component: BookingsListComponent },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/:categoryId', component: ProductsPageComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'users', component: UsersComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
