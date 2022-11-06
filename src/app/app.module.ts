import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SidenavWrapperComponent } from './sidenav-wrapper/sidenav-wrapper/sidenav-wrapper.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AddItemComponent } from './products/add-item/add-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { ProductListComponent } from './products/product-list/product-list.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { StockListComponent } from './stock-entry/stock-list/stock-list.component';
import { StockEntryRegisterComponent } from './stock-entry/stock-entry-register/stock-entry-register.component';
import { BillComponent } from './bill/bill.component';
import { EditBillComponent } from './bill/edit-bill/edit-bill.component';
import { BillheaderComponent } from './bill/billheader/billheader.component';
import { BilldetailComponent } from './bill/billdetail/billdetail.component';


@NgModule({
  declarations: [
    AppComponent,
    SidenavWrapperComponent,
    DashboardComponent,
    AddItemComponent,
    ProductListComponent,
    CustomersComponent,
    AddCustomerComponent,
    StockEntryComponent,
    StockListComponent,
    StockEntryRegisterComponent,
    BillComponent,
    EditBillComponent,
    BillheaderComponent,
    BilldetailComponent
  ],
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
