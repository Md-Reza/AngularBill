import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BillComponent } from './bill/bill.component';
import { BillheaderComponent } from './bill/billheader/billheader.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { SidenavWrapperComponent } from './sidenav-wrapper/sidenav-wrapper/sidenav-wrapper.component';
import { StockEntryRegisterComponent } from './stock-entry/stock-entry-register/stock-entry-register.component';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { StockListComponent } from './stock-entry/stock-list/stock-list.component';

const routes: Routes = [
  // Sidenavwrapper Component acts like a shell & the active child Component gets rendered into the <router-outlet>
  {
    path: '',
    component: SidenavWrapperComponent,
    children: [
      {
        path: 'app',
        component: AppComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'product-list',
        component: ProductListComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'create-stock',
        component: StockEntryComponent
      },
      {
        path: 'stock-list',
        component: StockListComponent
      },
      {
        path: 'stock-entry-register',
        component: StockEntryRegisterComponent
      },
      { path: 'bill', component: BillComponent },
      {
        path: 'billheader', children: [
          { path: '', component: BillheaderComponent },
          { path: 'edit/:id', component: BillheaderComponent }
        ]
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/app',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
