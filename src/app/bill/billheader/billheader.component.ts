import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { BillDetail } from 'src/app/models/billdetail.mode';
import { BillHeader } from 'src/app/models/billheader.model';
import { Customer } from 'src/app/models/customer.model';
import { ServiceService } from 'src/app/service/service.service';
import { BilldetailComponent } from '../billdetail/billdetail.component';

@Component({
  selector: 'app-billheader',
  templateUrl: './billheader.component.html',
  styleUrls: ['./billheader.component.css']
})
export class BillheaderComponent implements OnInit {

  billHeader!: BillHeader;

  order!: BillHeader;
  orderItems!: BillDetail[];
  customerList!: Customer[];
  customer!: Customer;

  isValid: boolean = true;

  myControl = new FormControl('');

  filteredOptions!: Observable<Customer[]>;

  constructor(public service: ServiceService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if (orderID == null)
      this.resetForm();
    else {
      this.service.getOrderByID(parseInt(orderID)).then((res: { order: BillHeader; orderDetail: BillDetail[]; }) => {
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetail;
      });
    }

    this.service.getCustomerList().then(res => this.customerList = res as Customer[]);

    this.filteredOptions =
      this.myControl.valueChanges.pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.customerList) :
          this.customerList.slice())
      );
  }

  displayFn(user?: any): string | string {
    return user ? user.custName : user.custName;
  }

  private _filter(name: string, lists: any[]): any[] {
    const filterValue = name.toLowerCase();

    return lists.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  resetForm(form?: NgForm) {
    if (form != null)
      this.resetForm();
    this.service.formData = {
      //billNo: Number(Math.floor(100000 + Math.random() * 900000)) ,
      billNo: 0,
      custId: '',
      pMethod: '',
      customer: this.customer,
      payAmount: 0,
      returnAmount: 0,
      totalQty: 0,
      totalAmount: 0
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex: any, billNo: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, billNo };
    this.dialog.open(BilldetailComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }


  onDeleteOrderItem(orderItemID: number, i: number) {
    if (orderItemID != null)
      this.service.orderItems.splice(i, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {

    //var totQty;
    //this.service.orderItems.forEach(items=>{totQty=items.qty});

    //this.service.orderItems.forEach(items=>{this.totQty=items.qty});
    this.service.formData.totalAmount = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.totalAmount;
    }, 0);
    this.service.formData.totalAmount = parseFloat(this.service.formData.totalAmount.toFixed(2));

    this.service.formData.totalQty = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.qty;
    }, 0);
    this.service.formData.payAmount = parseFloat(this.service.formData.totalAmount.toFixed(2));
  }

  validateForm() {
    this.isValid = true;
    if (this.service.formData.custId == '')
      this.isValid = false;
    if (this.service.formData.returnAmount < 0){
      this.isValid = false;
      this.toastr.error('Return Amount Should not Less then Payment Amount','Message');
    }
      
    else if (this.service.orderItems.length == 0)
      this.isValid = false;
    return this.isValid;
  }

  validationAmount() {
    this.service.formData.returnAmount = this.service.formData.payAmount - this.service.formData.totalAmount;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().pipe(
        catchError((error: HttpErrorResponse) => {
          return of(this.toastr.error(JSON.stringify(error.message)));
        })
      ).subscribe(res => {
        this.resetForm();
        this.toastr.success(JSON.stringify(res), 'Message');
        this.router.navigate(['/bill']);
      })
    }
  }

}
