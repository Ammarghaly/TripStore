import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { ServiceTestDashboardComponent } from './shared/components/service-test-dashboard/service-test-dashboard.component';
import { BookingConfirmationComponent } from './features/bookings/booking-confirmation.component';
import { BookingsListComponent } from './features/bookings/bookings-list.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test', component: ServiceTestDashboardComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'bookings', component: BookingsListComponent },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
