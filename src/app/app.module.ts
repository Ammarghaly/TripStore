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
import { App } from './app.component';
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

@NgModule({
  declarations: [
    App,
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
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
  bootstrap: [App],
})
export class AppModule {}
