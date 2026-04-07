import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { ServiceTestDashboardComponent } from './shared/components/service-test-dashboard/service-test-dashboard.component';

const routes: Routes = [
  { path: 'test', component: ServiceTestDashboardComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) },
  { path: '', redirectTo: '/cart', pathMatch: 'full' },
  { path: '**', redirectTo: '/cart' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
