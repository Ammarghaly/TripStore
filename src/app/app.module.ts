import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { CategorySectionComponent } from './shared/components/category-section/category-section.component';
import { CategoryCardComponent } from './shared/components/category-card/category-card.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { ProductsSectionComponent } from './shared/components/products-section/products-section.component';

@NgModule({
  declarations: [
    App,
    CategorySectionComponent,
    CategoryCardComponent,
    ProductCardComponent,
    ProductsSectionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
  bootstrap: [App],
})
export class AppModule {}
