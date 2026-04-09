import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProductsComponent } from './features/products/products.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { UsersComponent } from './features/users/users.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
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
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    OrdersComponent,
    ProductsComponent,
    CategoriesComponent,
    UsersComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
