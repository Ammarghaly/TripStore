import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AlertComponent } from './shared/alert/alert.component';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { BookingConfirmationComponent } from './features/bookings/booking-confirmation.component';
import { BookingsListComponent } from './features/bookings/bookings-list.component';
import { HomeComponent } from './pages/home/home.component';
import { CategorySectionComponent } from './shared/components/category-section/category-section.component';
import { CategoryCardComponent } from './shared/components/category-card/category-card.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { ProductsSectionComponent } from './shared/components/products-section/products-section.component';
import { ProductsPageComponent } from './features/products/products-page/products-page.component';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page.component';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
     RegisterComponent, LoginComponent,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    CheckoutComponent,
    BookingConfirmationComponent,
    BookingsListComponent,
    HomeComponent,
    CategorySectionComponent,
    CategoryCardComponent,
    ProductCardComponent,
    ProductsSectionComponent,
    ProductsPageComponent,
    CategoriesPageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
=======
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProductsComponent } from './features/products/products.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { UsersComponent } from './features/users/users.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [App, SidebarComponent, NavbarComponent, DashboardComponent, OrdersComponent, ProductsComponent, CategoriesComponent, UsersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
>>>>>>> origin/dashboard
  ],



  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
<<<<<<< HEAD
  bootstrap: [AppComponent],
})
export class AppModule {}

=======
  bootstrap: [App],
})
export class AppModule {}
>>>>>>> origin/dashboard
